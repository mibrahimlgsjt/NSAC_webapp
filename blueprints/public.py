from flask import Blueprint, render_template, request
from models import Animal, Sighting, FeedingLog, db
from datetime import datetime, timedelta, timezone

public_bp = Blueprint('public', __name__)

@public_bp.route('/')
def index():
    animals = Animal.query.all()
    # Check feeding status for last 4 hours
    four_hours_ago = datetime.now(timezone.utc) - timedelta(hours=4)
    
    # Updated NUST Hotspots based on Guide_MAP1.pdf
    sectors = [
        "Concordia 1",   # The main hub (C1)
        "Concordia 2",   # The other hub (C2)
        "NBS",           # NUST Business School
        "SEECS",         # School of Electrical Engineering & CS
        "SADA",          # School of Art, Design & Architecture
        "SMME",          # School of Mechanical & Manufacturing Engineering
        "Retro Cafe",    # Popular food spot
        "Margalla Cafe", # Near IESE
        "Sports Complex" # NUST Sports Complex
    ]
    
    feeding_status = {}
    
    for sector in sectors:
        last_fed = FeedingLog.query.filter(
            FeedingLog.location_sector == sector, 
            FeedingLog.timestamp >= four_hours_ago
        ).first()
        feeding_status[sector] = last_fed is not None
        
    return render_template('index.html', animals=animals, feeding_status=feeding_status)

@public_bp.route('/animal/<int:animal_id>')
def animal_detail(animal_id):
    animal = db.get_or_404(Animal, animal_id)
    recent_sighting = Sighting.query.filter_by(animal_id=animal.id).order_by(Sighting.timestamp.desc()).first()
    return render_template('animal_detail.html', animal=animal, sighting=recent_sighting)

@public_bp.route('/directory')
def directory():
    animals = Animal.query.order_by(Animal.name).all()
    return render_template('directory.html', animals=animals)

@public_bp.route('/report')
def report():
    return render_template('report.html')
