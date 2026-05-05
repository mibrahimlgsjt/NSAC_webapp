from datetime import datetime, timedelta, timezone
from flask import Blueprint, render_template, abort
from models import Animal, Sighting, FeedingLog, db

public_bp = Blueprint('public', __name__)

@public_bp.route('/')
def index():
    # Fetch animals for the "Trending" carousel (simplified logic for now)
    animals = Animal.query.limit(10).all()
    
    # Calculate sector feeding status for the last 4 hours
    four_hours_ago = datetime.now(timezone.utc) - timedelta(hours=4)
    sectors = ["C1", "C2", "NBS", "SEECS", "SADA", "SMME", "Retro", "Margalla"]
    
    feeding_status = {}
    for s in sectors:
        # Check if any feeding log exists for this sector in the last 4 hours
        log = FeedingLog.query.filter(
            FeedingLog.fed_at >= four_hours_ago
        ).join(Animal).filter(Animal.sector == s).first()
        feeding_status[s] = "fed" if log else "hungry"
        
    return render_template('public/index.html', animals=animals, feeding_status=feeding_status)

@public_bp.route('/directory')
def directory():
    animals = Animal.query.order_by(Animal.name).all()
    return render_template('public/directory.html', animals=animals)

@public_bp.route('/animal/<int:animal_id>')
def animal_detail(animal_id):
    animal = db.get_or_404(Animal, animal_id)
    recent_sightings = Sighting.query.filter_by(animal_id=animal.id).order_by(Sighting.created_at.desc()).limit(5).all()
    return render_template('public/animal_detail.html', animal=animal, sightings=recent_sightings)

@public_bp.route('/report')
def report():
    # Pass animals for selection in the form if needed
    animals = Animal.query.order_by(Animal.name).all()
    return render_template('public/report.html', animals=animals)
