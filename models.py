from extensions import db
from flask_login import UserMixin
from datetime import datetime, timezone

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default="admin") # "admin", "volunteer"

class Animal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    current_sector = db.Column(db.String(50), nullable=False, index=True)  # Indexed for map queries
    health_status = db.Column(db.String(50), default="Healthy")  # "Healthy", "Sick", "Injured"
    mood_badge = db.Column(db.String(50), default="Friendly") # "Friendly", "Shy", "Grumpy"
    identification_markers = db.Column(db.Text, nullable=True) # e.g., "White patch on left ear"
    history = db.Column(db.Text, nullable=True) # Personality or backstory
    sponsor_name = db.Column(db.String(100), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    blur_hash = db.Column(db.String(50), nullable=True)
    likes = db.Column(db.Integer, default=0)
    last_fed = db.Column(db.DateTime, nullable=True)
    personality_tags = db.Column(db.Text, default="Friendly,Sleepy") # Comma separated
    
    @property
    def hunger_score(self):
        if not self.last_fed:
            return 0
        
        last_fed_utc = self.last_fed
        if last_fed_utc.tzinfo is None:
            last_fed_utc = last_fed_utc.replace(tzinfo=timezone.utc)
            
        diff = datetime.now(timezone.utc) - last_fed_utc
        hours = diff.total_seconds() / 3600
        # If fed in last 4 hours, 100%. After 24 hours, 0%.
        score = max(0, 100 - (hours * 4)) 
        return int(score)

    @property
    def health_score(self):
        # Default 100. Subtract if active medical logs exist.
        if self.health_status == "Healthy":
            return 100
        elif self.health_status == "Sick":
            return 50
        else:
            return 30

    
    # Composite Index for optimization
    __table_args__ = (
        db.Index('idx_animal_sector_name', 'current_sector', 'name'),
    )

    sightings = db.relationship('Sighting', backref='animal', lazy=True)
    medical_logs = db.relationship('MedicalLog', backref='animal', lazy=True)
    comments = db.relationship('Comment', backref='animal', lazy=True, cascade="all, delete-orphan")

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)
    user_name = db.Column(db.String(100), default="Anonymous")
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

class Sighting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)
    location_sector = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    user_submitted_image = db.Column(db.String(500), nullable=True)
    blur_hash = db.Column(db.String(50), nullable=True)
    uploader_id = db.Column(db.String(100), nullable=True) # For user tracking
    likes = db.Column(db.Integer, default=0)

    # Composite Index for map optimization
    __table_args__ = (
        db.Index('idx_sighting_sector_time', 'location_sector', 'timestamp'),
    )

class MedicalLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)
    condition = db.Column(db.String(200), nullable=False)
    rescuer_name = db.Column(db.String(100), nullable=True)
    clinic_name = db.Column(db.String(100), nullable=True)
    cost = db.Column(db.Float, default=0.0)
    date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    release_date = db.Column(db.DateTime, nullable=True)

class FeedingLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    volunteer_name = db.Column(db.String(100), nullable=False)
    location_sector = db.Column(db.String(50), nullable=False)
    round_number = db.Column(db.Integer, nullable=False)  # 1, 2, or 3
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

class EmergencyReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    issue_type = db.Column(db.String(50), nullable=False) # "Minor Injury", "Sickness"
    location = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default="Pending") # "Pending", "Resolved"
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

class InventoryItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float, default=0.0)
    unit = db.Column(db.String(20), default="kg") # "kg", "units", "bottles"
    category = db.Column(db.String(1), default="C") # A (High value), B, C (Kibble)
    last_updated = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
