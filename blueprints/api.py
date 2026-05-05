import os
import uuid
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from PIL import Image
import blurhash
from models import db, Animal, Sighting, FeedingLog, MedicalLog, EmergencyReport, InventoryItem
from extensions import vote_bloom, cache

api_bp = Blueprint('api', __name__)

def handle_image_upload(file, folder='sightings'):
    """Resize image and return relative path + blurhash."""
    if not file:
        return None, None
        
    # Generate unique filename
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    
    # Ensure directory exists
    upload_dir = os.path.join(current_app.root_path, 'static', 'uploads', folder)
    os.makedirs(upload_dir, exist_ok=True)
    
    filepath = os.path.join(upload_dir, filename)
    
    # Open and Resize
    img = Image.open(file)
    # Convert to RGB if necessary (for JPEG/BlurHash)
    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    img.thumbnail((800, 800))
    img.save(filepath)
    
    # Generate BlurHash
    # Use a small version for hash generation for speed
    hash_img = img.copy()
    hash_img.thumbnail((100, 100))
    hash_str = blurhash.encode(hash_img, x_components=4, y_components=3)
    
    return f"/static/uploads/{folder}/{filename}", hash_str

@api_bp.route('/api/animals/trending')
@cache.cached(timeout=300)
def trending():
    # Simple logic: Most liked first
    animals = Animal.query.order_by(Animal.likes.desc()).limit(10).all()
    return jsonify([{
        'id': a.id,
        'name': a.name,
        'likes': a.likes,
        'sector': a.sector,
        'image': a.image_url
    } for a in animals])

@api_bp.route('/api/animals/<int:animal_id>/sightings')
def animal_sightings(animal_id):
    sightings = Sighting.query.filter_by(animal_id=animal_id).order_by(Sighting.created_at.desc()).limit(20).all()
    return jsonify([{
        'id': s.id,
        'location': s.location_hint,
        'image': s.image_path,
        'blurhash': s.blurhash,
        'created_at': s.created_at.isoformat()
    } for s in sightings])

@api_bp.route('/api/animals/<int:animal_id>/karma', methods=['POST'])
def animal_karma(animal_id):
    tag = request.json.get('tag', 'General')
    user_ip = request.remote_addr
    fingerprint = f"{user_ip}:{animal_id}:{tag}"
    
    if vote_bloom.lookup(fingerprint):
        return jsonify({'error': 'Already voted for this trait recently!'}), 403
        
    animal = db.get_or_404(Animal, animal_id)
    animal.likes += 1
    vote_bloom.add(fingerprint)
    db.session.commit()
    
    return jsonify({'success': True, 'new_likes': animal.likes})

@api_bp.route('/api/feed', methods=['POST'])
@login_required
def log_feeding():
    animal_id = request.form.get('animal_id')
    notes = request.form.get('notes')
    
    animal = db.get_or_404(Animal, animal_id)
    log = FeedingLog(
        animal_id=animal.id,
        volunteer_id=current_user.id,
        fed_at=datetime.now(timezone.utc),
        notes=notes
    )
    animal.last_fed_at = log.fed_at
    db.session.add(log)
    db.session.commit()
    
    return jsonify({'success': True, 'last_fed': animal.last_fed_at.isoformat()})

@api_bp.route('/api/medical', methods=['POST'])
@login_required
def open_medical():
    animal_id = request.form.get('animal_id')
    description = request.form.get('description')
    
    animal = db.get_or_404(Animal, animal_id)
    log = MedicalLog(
        animal_id=animal.id,
        volunteer_id=current_user.id,
        description=description,
        status='open',
        opened_at=datetime.now(timezone.utc)
    )
    animal.health_status = 'Injured' # Default for new log
    db.session.add(log)
    db.session.commit()
    
    return jsonify({'success': True, 'log_id': log.id})

@api_bp.route('/api/inventory/update', methods=['POST'])
@login_required
def update_inventory():
    if current_user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
        
    item_id = request.json.get('item_id')
    new_quantity = request.json.get('quantity')
    
    item = db.get_or_404(InventoryItem, item_id)
    item.quantity = new_quantity
    item.last_updated = datetime.now(timezone.utc)
    db.session.commit()
    
    return jsonify({'success': True})

@api_bp.route('/api/sighting', methods=['POST'])
def submit_sighting():
    animal_id = request.form.get('animal_id')
    location = request.form.get('location')
    image_file = request.files.get('image')
    
    path, bhash = handle_image_upload(image_file)
    
    sighting = Sighting(
        animal_id=animal_id,
        location_hint=location,
        image_path=path,
        blurhash=bhash,
        created_at=datetime.now(timezone.utc)
    )
    db.session.add(sighting)
    db.session.commit()
    
    return jsonify({'success': True, 'sighting_id': sighting.id})

@api_bp.route('/api/emergency', methods=['POST'])
def submit_emergency():
    animal_id = request.form.get('animal_id')
    location = request.form.get('location')
    severity = request.form.get('severity', 'other')
    description = request.form.get('description')
    reporter = request.form.get('reporter_name', 'Anonymous Student')
    
    report = EmergencyReport(
        animal_id=animal_id if animal_id else None,
        location=location,
        severity=severity,
        description=description,
        reporter_name=reporter,
        created_at=datetime.now(timezone.utc)
    )
    db.session.add(report)
    db.session.commit()
    
    return jsonify({'success': True, 'report_id': report.id})
