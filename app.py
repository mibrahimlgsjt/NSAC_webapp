from flask import Flask
from extensions import db, cache, login_manager, compress
from models import Animal, Sighting, MedicalLog, FeedingLog, EmergencyReport, InventoryItem, User
from blueprints.public import public_bp
from blueprints.admin import admin_bp
from blueprints.api import api_bp
from blueprints.auth import auth_bp
import random
import os
from datetime import datetime, timedelta, timezone

app = Flask(__name__)

# Production Database Configuration
database_url = os.environ.get('DATABASE_URL')
if database_url:
    # Fix for Heroku/Render Postgres URLs starting with postgres://
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nsac.sqlite'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'nsac_secret_key') # Use env var in prod
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 300

db.init_app(app)
cache.init_app(app)
login_manager.init_app(app)
compress.init_app(app)
login_manager.login_view = 'auth.login'

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

app.register_blueprint(public_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(api_bp)
app.register_blueprint(auth_bp)

def seed_database():
    with app.app_context():
        db.create_all()
        
        # Create default admin and volunteer if not exists
        from werkzeug.security import generate_password_hash
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', password_hash=generate_password_hash('NSAC2026'), role='admin')
            db.session.add(admin)
            
        if not User.query.filter_by(username='volunteer').first():
            volunteer = User(username='volunteer', password_hash=generate_password_hash('NSAC2026'), role='volunteer')
            db.session.add(volunteer)
            
        db.session.commit()
        print("Default users created.")

        # Seed logic updated for Guide_MAP1.pdf locations
        if not Animal.query.first():
            print("Seeding database with NUST Map data...")
            
            # 1. Animals (10) - Assigned to specific "Homes"
            # Locations based on Guide_MAP1.pdf
            # Concordia 1 (#39), Concordia 2 (#40), NBS (#3), SEECS (#9), SADA (#6), SMME (#10)
            
            animals_data = [
                ("Gora", "Concordia 1", "Healthy", "Friendly", "Pure white fur, clipped left ear.", "Hangs out near the C1 cafe.", "Dr. Sarah", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400"),
                ("Sheru", "NBS", "Sick", "Shy", "Golden coat with black tip.", "Usually sleeps in the NBS parking lot.", None, "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400"),
                ("Oreo", "SEECS", "Healthy", "Playful", "Black and white tuxedo.", "Loves the SEECS foyer AC.", "NBS Batch 24", "https://images.unsplash.com/photo-1511497584788-c76fc42c9535?auto=format&fit=crop&q=80&w=400"),
                ("Mano", "Concordia 2", "Healthy", "Independent", "Calico, green eyes.", "Protects the C2 entrance.", None, "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=400"),
                ("Rani", "SADA", "Injured", "Grumpy", "Ginger tabby, limp.", "Found near the SADA studios.", "Club President", "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=400"),
                ("Luna", "Retro Cafe", "Healthy", "Friendly", "Grey with white paws.", "Begs for fries at Retro.", "SEECS Faculty", "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=400"),
                ("Simba", "SMME", "Healthy", "Playful", "Orange tabby.", "King of the SMME workshops.", None, "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=400"),
                ("Bella", "Margalla Cafe", "Sick", "Shy", "Tortoiseshell.", "Needs eye drops. Spotted near IESE.", "Volunteer Team", "https://images.unsplash.com/photo-1491485880348-85d48a9e5312?auto=format&fit=crop&q=80&w=400"),
                ("Rocky", "Sports Complex", "Healthy", "Grumpy", "Black with scar.", "Patrols the cricket ground.", None, "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&q=80&w=400"),
                ("Coco", "Concordia 1", "Healthy", "Friendly", "Chocolate brown.", "Loves belly rubs from freshies.", "CS Batch 25", "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?auto=format&fit=crop&q=80&w=400")
            ]
            
            created_animals = []
            for data in animals_data:
                animal = Animal(
                    name=data[0],
                    current_sector=data[1],
                    health_status=data[2],
                    mood_badge=data[3],
                    identification_markers=data[4],
                    history=data[5],
                    sponsor_name=data[6],
                    image_url=data[7],
                    last_fed=datetime.now(timezone.utc) - timedelta(hours=random.randint(1, 12))
                )
                db.session.add(animal)
                created_animals.append(animal)
            db.session.commit()
            
            # 2. Sightings (50) - Randomly distributed across NUST Hotspots
            hotspots = [
                "Concordia 1", "Concordia 2", "NBS", "SEECS", 
                "SADA", "SMME", "Retro Cafe", "Margalla Cafe", "Sports Complex"
            ]
            print("Seeding sightings...")
            for _ in range(50):
                animal = random.choice(created_animals)
                sighting = Sighting(
                    animal_id=animal.id,
                    location_sector=random.choice(hotspots),
                    timestamp=datetime.now(timezone.utc) - timedelta(hours=random.randint(0, 48)),
                    user_submitted_image=animal.image_url, # Reusing image for mock
                    likes=random.randint(0, 20) # Random initial likes
                )
                db.session.add(sighting)
            
            # 3. Inventory
            print("Seeding inventory...")
            inventory = [
                InventoryItem(name="Antibiotics", quantity=10, unit="bottles", category="A"),
                InventoryItem(name="Painkillers", quantity=20, unit="strips", category="A"),
                InventoryItem(name="Bandages", quantity=50, unit="rolls", category="B"),
                InventoryItem(name="Cat Food (Dry)", quantity=15, unit="kg", category="C"),
                InventoryItem(name="Dog Food (Wet)", quantity=5, unit="cans", category="C"),
            ]
            db.session.bulk_save_objects(inventory)
            
            db.session.commit()
            print("Database Seeded Successfully!")

if __name__ == '__main__':
    with app.app_context():
        seed_database()
    app.run(debug=True, port=5000)
