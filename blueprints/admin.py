import csv
import io
from datetime import datetime, timezone
from flask import Blueprint, render_template, redirect, url_for, make_response, abort
from flask_login import login_required, current_user
from models import db, Animal, MedicalLog, FeedingLog, EmergencyReport, InventoryItem

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin')
def admin_root():
    if current_user.is_authenticated:
        return redirect(url_for('admin.panel'))
    return redirect(url_for('auth.login'))

@admin_bp.route('/admin/panel')
@login_required
def panel():
    # Fetch summary data for the dashboard
    open_medical = MedicalLog.query.filter_by(status='open').order_by(MedicalLog.opened_at.desc()).all()
    recent_feedings = FeedingLog.query.order_by(FeedingLog.fed_at.desc()).limit(5).all()
    emergency_alerts = EmergencyReport.query.order_by(EmergencyReport.created_at.desc()).limit(5).all()
    
    # Calculate low stock alerts (Category A < 5, C < 10)
    low_stock = InventoryItem.query.filter(
        ((InventoryItem.category == 'A') & (InventoryItem.quantity < 5)) |
        ((InventoryItem.category == 'C') & (InventoryItem.quantity < 10))
    ).all()
    
    # Summary stats for KPI grid
    stats = {
        'open_cases': MedicalLog.query.filter_by(status='open').count(),
        'fed_today': FeedingLog.query.filter(FeedingLog.fed_at >= datetime.now(timezone.utc).replace(hour=0, minute=0, second=0)).count(),
        'low_stock': len(low_stock),
        'total_alerts': EmergencyReport.query.count()
    }
    
    # Fetch animals for the feeding log modal
    animals = Animal.query.order_by(Animal.name).all()
    
    return render_template('admin/admin_panel.html', 
                           open_medical=open_medical, 
                           recent_feedings=recent_feedings, 
                           emergency_alerts=emergency_alerts,
                           low_stock=low_stock,
                           stats=stats,
                           animals=animals)

@admin_bp.route('/admin/medical')
@login_required
def medical():
    logs = MedicalLog.query.order_by(MedicalLog.status.desc(), MedicalLog.opened_at.desc()).all()
    return render_template('admin/medical.html', logs=logs)

@admin_bp.route('/admin/inventory')
@login_required
def inventory():
    if current_user.role != 'admin':
        abort(403)
    
    items = InventoryItem.query.order_by(InventoryItem.category, InventoryItem.name).all()
    return render_template('admin/inventory.html', items=items)

@admin_bp.route('/admin/animals')
@login_required
def animals_list():
    animals = Animal.query.order_by(Animal.name).all()
    return render_template('admin/animals_list.html', animals=animals)

@admin_bp.route('/admin/animals/add', methods=['GET', 'POST'])
@login_required
def animal_add():
    if request.method == 'POST':
        from blueprints.api import handle_image_upload
        image_file = request.files.get('image')
        path, bhash = handle_image_upload(image_file, folder='animals')
        
        new_animal = Animal(
            name=request.form.get('name'),
            species=request.form.get('species'),
            sector=request.form.get('sector'),
            mood=request.form.get('mood', 'Friendly'),
            health_status=request.form.get('health_status', 'Healthy'),
            personality_tags=request.form.get('personality_tags', ''),
            image_url=path,
            blurhash=bhash
        )
        db.session.add(new_animal)
        db.session.commit()
        return redirect(url_for('admin.animals_list'))
    return render_template('admin/animal_form.html', animal=None)

@admin_bp.route('/admin/animals/edit/<int:animal_id>', methods=['GET', 'POST'])
@login_required
def animal_edit(animal_id):
    animal = db.get_or_404(Animal, animal_id)
    if request.method == 'POST':
        from blueprints.api import handle_image_upload
        image_file = request.files.get('image')
        if image_file:
            path, bhash = handle_image_upload(image_file, folder='animals')
            animal.image_url = path
            animal.blurhash = bhash
            
        animal.name = request.form.get('name')
        animal.species = request.form.get('species')
        animal.sector = request.form.get('sector')
        animal.mood = request.form.get('mood')
        animal.health_status = request.form.get('health_status')
        animal.personality_tags = request.form.get('personality_tags')
        
        db.session.commit()
        return redirect(url_for('admin.animals_list'))
    return render_template('admin/animal_form.html', animal=animal)

@admin_bp.route('/admin/animals/delete/<int:animal_id>', methods=['POST'])
@login_required
def animal_delete(animal_id):
    if current_user.role != 'admin':
        abort(403)
    animal = db.get_or_404(Animal, animal_id)
    db.session.delete(animal)
    db.session.commit()
    return redirect(url_for('admin.animals_list'))

@admin_bp.route('/admin/inventory/add', methods=['GET', 'POST'])
@login_required
def inventory_add():
    if current_user.role != 'admin':
        abort(403)
    if request.method == 'POST':
        new_item = InventoryItem(
            name=request.form.get('name'),
            category=request.form.get('category'),
            quantity=float(request.form.get('quantity')),
            unit=request.form.get('unit'),
            low_stock_threshold=float(request.form.get('threshold', 5))
        )
        db.session.add(new_item)
        db.session.commit()
        return redirect(url_for('admin.inventory'))
    return render_template('admin/inventory_form.html', item=None)

@admin_bp.route('/admin/inventory/edit/<int:item_id>', methods=['GET', 'POST'])
@login_required
def inventory_edit(item_id):
    if current_user.role != 'admin':
        abort(403)
    item = db.get_or_404(InventoryItem, item_id)
    if request.method == 'POST':
        item.name = request.form.get('name')
        item.category = request.form.get('category')
        item.quantity = float(request.form.get('quantity'))
        item.unit = request.form.get('unit')
        item.low_stock_threshold = float(request.form.get('threshold'))
        item.last_updated = datetime.now(timezone.utc)
        db.session.commit()
        return redirect(url_for('admin.inventory'))
    return render_template('admin/inventory_form.html', item=item)

@admin_bp.route('/admin/inventory/delete/<int:item_id>', methods=['POST'])
@login_required
def inventory_delete(item_id):
    if current_user.role != 'admin':
        abort(403)
    item = db.get_or_404(InventoryItem, item_id)
    db.session.delete(item)
    db.session.commit()
    return redirect(url_for('admin.inventory'))

@admin_bp.route('/admin/medical/close/<int:log_id>', methods=['POST'])
@login_required
def medical_close(log_id):
    log = db.get_or_404(MedicalLog, log_id)
    log.status = 'closed'
    log.closed_at = datetime.now(timezone.utc)
    log.cost = float(request.form.get('cost', 0))
    
    # Update animal status if all logs closed
    open_logs = MedicalLog.query.filter_by(animal_id=log.animal_id, status='open').count()
    if open_logs == 0:
        log.animal.health_status = 'Healthy'
        
    db.session.commit()
    return redirect(url_for('admin.medical'))
