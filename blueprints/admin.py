from flask import Blueprint, render_template, redirect, url_for, make_response
from flask_login import login_required, current_user
from models import db, Animal, MedicalLog, FeedingLog, EmergencyReport, InventoryItem
import csv
import io
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin')
def admin_root():
    if current_user.is_authenticated:
        return redirect(url_for('admin.panel'))
    return redirect(url_for('auth.login'))

@admin_bp.route('/admin/panel')
@login_required
def panel():
    # Volunteers can access feeding and emergency reports, but not inventory or bulk delete
    # Admins get full view
    animals = Animal.query.all()
    medical_logs = MedicalLog.query.order_by(MedicalLog.date.desc()).all()
    feeding_logs = FeedingLog.query.order_by(FeedingLog.timestamp.desc()).limit(10).all()
    emergency_reports = EmergencyReport.query.order_by(EmergencyReport.timestamp.desc()).all()
    inventory_items = InventoryItem.query.all()
    
    # Check for low stock alerts (Example logic)
    alerts = []
    for item in inventory_items:
        # Simple threshold logic
        if item.category == 'A' and item.quantity < 5:
            alerts.append(f"Low Stock: {item.name} (Category A)")
        elif item.category == 'C' and item.quantity < 20:
            alerts.append(f"Low Stock: {item.name} (Category C)")
            
    return render_template('admin_panel.html', 
                           animals=animals, 
                           medical_logs=medical_logs, 
                           feeding_logs=feeding_logs, 
                           emergency_reports=emergency_reports, 
                           inventory_items=inventory_items,
                           alerts=alerts)

@admin_bp.route('/admin/export/logs')
@login_required
def export_logs():
    if current_user.role != 'admin':
        return "Access Denied: Admins Only", 403
        
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Date', 'Animal', 'Condition', 'Clinic', 'Cost', 'Rescuer', 'Release Date'])
    
    logs = MedicalLog.query.all()
    for log in logs:
        writer.writerow([
            log.date.strftime('%Y-%m-%d'),
            log.animal.name,
            log.condition,
            log.clinic_name or '-',
            log.cost,
            log.rescuer_name or '-',
            log.release_date.strftime('%Y-%m-%d') if log.release_date else '-'
        ])
    
    response = make_response(output.getvalue())
    response.headers["Content-Disposition"] = "attachment; filename=nsac_medical_logs.csv"
    response.headers["Content-type"] = "text/csv"
    return response
