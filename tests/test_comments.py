import pytest
from app import app, db
from models import User, Animal, Comment
from werkzeug.security import generate_password_hash

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['WTF_CSRF_ENABLED'] = False

    with app.app_context():
        db.create_all()
        # Seed user if not exists
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', password_hash=generate_password_hash('pass'), role='admin')
            db.session.add(admin)
            db.session.commit()

    with app.test_client() as client:
        yield client

    with app.app_context():
        db.drop_all()

def test_comment_api(client):
    # Create an animal
    with app.app_context():
        animal = Animal(name="TestCat", current_sector="NBS")
        db.session.add(animal)
        db.session.commit()
        animal_id = animal.id

    # Test adding a comment
    rv = client.post(f'/api/animal/{animal_id}/comments', json={'content': 'Cute cat!'})
    assert rv.status_code == 200
    data = rv.get_json()
    assert data['success'] is True
    assert data['comment']['content'] == 'Cute cat!'
    assert data['comment']['user_name'] == 'Anonymous'

    # Test getting comments
    rv = client.get(f'/api/animal/{animal_id}/comments')
    assert rv.status_code == 200
    data = rv.get_json()
    assert len(data) == 1
    assert data[0]['content'] == 'Cute cat!'

def test_comment_api_logged_in(client):
    # Create an animal
    with app.app_context():
        animal = Animal(name="TestCat", current_sector="NBS")
        db.session.add(animal)
        db.session.commit()
        animal_id = animal.id

    # Login
    client.post('/login', data=dict(username='admin', password='pass'), follow_redirects=True)

    # Test adding a comment
    rv = client.post(f'/api/animal/{animal_id}/comments', json={'content': 'Official comment'})
    assert rv.status_code == 200
    data = rv.get_json()
    assert data['comment']['user_name'] == 'admin'
