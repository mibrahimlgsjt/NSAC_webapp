from flask import Blueprint, jsonify, request, session, redirect, url_for, current_app
from flask_login import current_user, login_required
from models import db, Animal, FeedingLog, MedicalLog, InventoryItem, EmergencyReport, Sighting
from datetime import datetime, timezone
from utils.image_handler import save_image
from extensions import cache, vote_bloom

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/animal/<int:animal_id>/vote_tag', methods=['POST'])
def vote_tag(animal_id):
    tag = request.json.get('tag')
    ip = request.remote_addr
    vote_key = f"{ip}:{animal_id}:{tag}"
    
    if vote_key in vote_bloom:
        return jsonify(error="You already voted for this today! 🐾", karma=0), 403
        
    animal = db.get_or_404(Animal, animal_id)
    tags = animal.personality_tags.split(',') if animal.personality_tags else []
    
    if tag not in tags:
        tags.append(tag)
        animal.personality_tags = ','.join(tags)
        db.session.commit()
        
    vote_bloom.add(vote_key)
    return jsonify(success=True, message=f"Tag '{tag}' added! +5 Karma ✨", karma=5)

@api_bp.route('/like/<int:animal_id>', methods=['POST'])
def like_animal(animal_id):
    animal = db.get_or_404(Animal, animal_id)
    animal.likes += 1
    db.session.commit()
    return jsonify(likes=animal.likes)

@api_bp.route('/feed', methods=['POST'])
@login_required
def feed_animal():
    data = request.json
    sector = data.get('sector')
    
    new_log = FeedingLog(
        volunteer_name=current_user.username,
        location_sector=sector,
        round_number=int(data.get('round', 1)),
        timestamp=datetime.now(timezone.utc)
    )
    
    # Update last_fed for all animals in this sector
    animals_in_sector = Animal.query.filter_by(current_sector=sector).all()
    for animal in animals_in_sector:
        animal.last_fed = datetime.now(timezone.utc)
        
    db.session.add(new_log)
    db.session.commit()
    return jsonify(success=True)

@api_bp.route('/medical', methods=['POST'])
@login_required
def add_medical_log():
    data = request.form
    new_log = MedicalLog(
        animal_id=int(data.get('animal_id')),
        condition=data.get('condition'),
        rescuer_name=data.get('rescuer_name'),
        clinic_name=data.get('clinic_name'),
        cost=float(data.get('cost', 0)),
        date=datetime.now(timezone.utc)
    )
    
    release_date_str = data.get('release_date')
    if release_date_str:
        new_log.release_date = datetime.strptime(release_date_str, '%Y-%m-%d')
        
    db.session.add(new_log)
    db.session.commit()
    return redirect(url_for('admin.panel'))

@api_bp.route('/inventory/update', methods=['POST'])
@login_required
def update_inventory():
    data = request.form
    item_id = data.get('item_id')
    if item_id:
        item = db.session.get(InventoryItem, item_id)
    else:
        item = InventoryItem()
        db.session.add(item)
        
    item.name = data.get('name')
    item.quantity = float(data.get('quantity', 0))
    item.unit = data.get('unit')
    item.category = data.get('category')
    
    db.session.commit()
    return redirect(url_for('admin.panel'))

@api_bp.route('/report', methods=['POST'])
def submit_report():
    data = request.form
    new_report = EmergencyReport(
        issue_type=data.get('issue_type'),
        location=data.get('location'),
        description=data.get('description'),
        status="Pending"
    )
    db.session.add(new_report)
    db.session.commit()
    return jsonify(success=True, message="Admin team alerted!")

@api_bp.route('/resolve_report/<int:report_id>', methods=['POST'])
@login_required
def resolve_report(report_id):
    report = db.get_or_404(EmergencyReport, report_id)
    report.status = "Resolved"
    db.session.commit()
    return jsonify(success=True)

@api_bp.route('/animal/add', methods=['POST'])
@login_required
def add_animal():
    if current_user.role != 'admin':
        return jsonify(error="Admins only"), 403
    data = request.form
    new_animal = Animal(
        name=data.get('name'),
        current_sector=data.get('sector'),
        health_status=data.get('health_status'),
        mood_badge=data.get('mood_badge'),
        identification_markers=data.get('identification_markers'),
        history=data.get('history'),
        sponsor_name=data.get('sponsor_name'),
        image_url=data.get('image_url')
    )
    db.session.add(new_animal)
    db.session.commit()
    return redirect(url_for('admin.panel'))

@api_bp.route('/animal/delete/<int:animal_id>', methods=['POST'])
@login_required
def delete_animal(animal_id):
    if current_user.role != 'admin':
        return jsonify(error="Admins only"), 403
    animal = db.get_or_404(Animal, animal_id)
    db.session.delete(animal)
    db.session.commit()
    return redirect(url_for('admin.panel'))

# --- New Endpoints for Round 3 (Public Uploads & Likes) ---

@api_bp.route('/sighting/upload', methods=['POST'])
def upload_sighting():
    # Public endpoint - No login required
    animal_id = request.form.get('animal_id')
    location = request.form.get('location')

    animal = db.session.get(Animal, animal_id)
    if not animal:
        return jsonify(error="Animal not found"), 404
    
    if 'sighting_image' not in request.files:
        return jsonify(error="No image uploaded"), 400
        
    file = request.files['sighting_image']
    if file.filename == '':
        return jsonify(error="No selected file"), 400
        
    # Use image_handler to resize and save
    image_path, blur_hash = save_image(file, subfolder='sightings')
    
    if not image_path:
        return jsonify(error="Invalid file or upload failed"), 400
        
    new_sighting = Sighting(
        animal_id=animal_id,
        location_sector=location,
        user_submitted_image=image_path,
        blur_hash=blur_hash,
        timestamp=datetime.now(timezone.utc),
        uploader_id=session.get('user_id', 'anonymous'),
        likes=0
    )
    
    # Update animal's current location based on this latest sighting
    animal.current_sector = location
    
    db.session.add(new_sighting)
    db.session.commit()
    
    return jsonify(success=True, image_url=url_for('static', filename=image_path), message="Sighting uploaded! +10 Karma ✨")

@api_bp.route('/sighting/<int:sighting_id>/like', methods=['POST'])
def like_sighting(sighting_id):
    sighting = db.get_or_404(Sighting, sighting_id)
    sighting.likes += 1
    db.session.commit()
    return jsonify(likes=sighting.likes, success=True)

# --- Round 4: Paginated Sightings ---
@api_bp.route('/sightings/<int:animal_id>', methods=['GET'])
def get_paginated_sightings(animal_id):
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    pagination = Sighting.query.filter_by(animal_id=animal_id).order_by(Sighting.timestamp.desc()).paginate(page=page, per_page=limit, error_out=False)
    
    result = []
    for s in pagination.items:
        result.append({
            'id': s.id,
            'image_url': url_for('static', filename=s.user_submitted_image) if s.user_submitted_image else None,
            'blur_hash': s.blur_hash,
            'location': s.location_sector,
            'timestamp': s.timestamp.strftime('%d %b %H:%M'),
            'likes': s.likes
        })
        
    return jsonify({
        'items': result,
        'has_next': pagination.has_next,
        'next_page': pagination.next_num
    })

# --- Round 4: Trending Animals (LRU Cache) ---
@api_bp.route('/trending', methods=['GET'])
@cache.cached(timeout=300, key_prefix='trending_animals')
def get_trending_animals():
    # Get top 5 animals by likes
    trending = Animal.query.order_by(Animal.likes.desc()).limit(5).all()
    
    result = []
    for animal in trending:
        result.append({
            'id': animal.id,
            'name': animal.name,
            'likes': animal.likes,
            'image_url': animal.image_url,
            'sector': animal.current_sector
        })
        
    return jsonify(result)
