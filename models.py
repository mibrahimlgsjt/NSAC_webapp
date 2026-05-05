from datetime import datetime, timezone
from flask_login import UserMixin
from sqlalchemy import Index
from extensions import db

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default="admin")  # "admin", "volunteer"
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    feeding_logs = db.relationship('FeedingLog', backref='volunteer', lazy=True)
    medical_logs = db.relationship('MedicalLog', backref='volunteer', lazy=True)
    sightings = db.relationship('Sighting', backref='reporter', lazy=True)

class Animal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    species = db.Column(db.String(50), default="Cat")  # Cat, Dog, etc.
    sector = db.Column(db.String(50), nullable=False, index=True)
    health_status = db.Column(db.String(50), default="Healthy")  # "Healthy", "Sick", "Injured"
    mood = db.Column(db.String(50), default="Friendly")  # "Friendly", "Shy", "Grumpy"
    image_url = db.Column(db.String(500), nullable=True)
    last_fed_at = db.Column(db.DateTime, nullable=True)
    blurhash = db.Column(db.String(50), nullable=True)
    personality_tags = db.Column(db.Text, default="Friendly,Sleepy")  # Comma separated

    # Relationships
    sightings = db.relationship('Sighting', backref='animal', lazy=True)
    medical_logs = db.relationship('MedicalLog', backref='animal', lazy=True)
    feeding_logs = db.relationship('FeedingLog', backref='animal', lazy=True)
    emergency_reports = db.relationship('EmergencyReport', backref='animal', lazy=True)

    @property
    def hunger_score(self):
        if not self.last_fed_at:
            return 0
        last_fed_utc = self.last_fed_at
        if last_fed_utc.tzinfo is None:
            last_fed_utc = last_fed_utc.replace(tzinfo=timezone.utc)
        diff = datetime.now(timezone.utc) - last_fed_utc
        hours = diff.total_seconds() / 3600
        score = max(0, 100 - (hours * 4))
        return int(score)

    # Composite Index for sector status queries
    __table_args__ = (
        db.Index('ix_animal_sector_fed', 'sector', 'last_fed_at'),
    )

class Sighting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # reporter_name in design, but let's use user ref if possible
    reporter_name = db.Column(db.String(100), nullable=True)  # Fallback for students
    image_path = db.Column(db.String(500), nullable=True)
    blurhash = db.Column(db.String(50), nullable=True)
    location_hint = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Composite Index for paginated feeds
    __table_args__ = (
        db.Index('ix_sighting_animal_created', 'animal_id', 'created_at'),
    )

class FeedingLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    fed_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    notes = db.Column(db.Text, nullable=True)

class MedicalLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default="open")  # "open", "closed"
    description = db.Column(db.Text, nullable=False)
    cost = db.Column(db.Float, default=0.0)
    opened_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    closed_at = db.Column(db.DateTime, nullable=True)

class EmergencyReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=True)
    reporter_name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    severity = db.Column(db.String(50), nullable=False)  # "minor_injury", "sickness", "other"
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

class InventoryItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(1), default="C")  # A, B, C
    ved_category = db.Column(db.String(1), default="D")  # V, E, D
    quantity = db.Column(db.Float, default=0.0)
    unit = db.Column(db.String(20), default="kg")
    low_stock_threshold = db.Column(db.Float, default=5.0)
    last_updated = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
