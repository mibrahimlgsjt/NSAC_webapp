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
    
    return render_template('admin/admin_panel.html', 
                           open_medical=open_medical, 
                           recent_feedings=recent_feedings, 
                           emergency_alerts=emergency_alerts,
                           low_stock=low_stock)

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

@admin_bp.route('/admin/export')
@login_required
def export():
    if current_user.role != 'admin':
        abort(403)
        
    si = io.StringIO()
    cw = csv.writer(si)
    cw.writerow(['ID', 'Animal', 'Volunteer', 'Status', 'Description', 'Cost', 'Opened At', 'Closed At'])
    
    logs = MedicalLog.query.all()
    for log in logs:
        cw.writerow([
            log.id,
            log.animal.name if log.animal else 'N/A',
            log.volunteer.username if log.volunteer else 'N/A',
            log.status,
            log.description,
            log.cost,
            log.opened_at.strftime('%Y-%m-%d %H:%M') if log.opened_at else 'N/A',
            log.closed_at.strftime('%Y-%m-%d %H:%M') if log.closed_at else 'N/A'
        ])
    
    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = "attachment; filename=medical_logs.csv"
    output.headers["Content-type"] = "text/csv"
    return output
