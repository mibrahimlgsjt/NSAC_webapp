import pytest
from app import create_app
from extensions import db
from models import User, Animal
from werkzeug.security import generate_password_hash
from io import BytesIO
from PIL import Image

@pytest.fixture
def app_instance():
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'WTF_CSRF_ENABLED': False,
        'SECRET_KEY': 'test_secret',
        'CACHE_TYPE': 'SimpleCache'
    })
    
    with app.app_context():
        db.create_all()
        # Seed user if not exists
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', password_hash=generate_password_hash('pass'), role='admin')
            db.session.add(admin)
            db.session.commit()
        
        yield app
        
        db.drop_all()

@pytest.fixture
def client(app_instance):
    with app_instance.test_client() as client:
        yield client

def test_home_page(client):
    rv = client.get('/')
    assert rv.status_code == 200
    assert b'Campus Companions' in rv.data

def test_admin_login(client):
    rv = client.post('/login', data=dict(
        username='admin',
        password='pass'
    ), follow_redirects=True)
    assert rv.status_code == 200
    assert b'Admin' in rv.data 

def test_sighting_upload_flow(client, app_instance):
    with app_instance.app_context():
        a = Animal(name='TestCat', current_sector='NBS')
        db.session.add(a)
        db.session.commit()
        aid = a.id
        
    img_io = BytesIO()
    img = Image.new('RGB', (100, 100), color='red')
    img.save(img_io, 'JPEG')
    img_io.seek(0)

    data = {
        'animal_id': aid,
        'location': 'SEECS',
        'sighting_image': (img_io, 'valid.jpg')
    }
    
    rv = client.post('/api/sighting/upload', data=data, content_type='multipart/form-data')
    assert rv.status_code == 200
    assert b'success' in rv.data
    assert b'Karma' in rv.data

def test_trending_endpoint(client):
    rv = client.get('/api/trending')
    assert rv.status_code == 200
    assert isinstance(rv.get_json(), list)

def test_tag_voting(client, app_instance):
    with app_instance.app_context():
        a = Animal(name='VoteCat', current_sector='NBS')
        db.session.add(a)
        db.session.commit()
        aid = a.id
        
    rv = client.post(f'/api/animal/{aid}/vote_tag', 
                     json={'tag': 'Playful'})
    assert rv.status_code == 200
    assert b'Karma' in rv.data
    
    # Second vote from same IP (mocked as same in test) should fail (Bloom Filter)
    rv2 = client.post(f'/api/animal/{aid}/vote_tag', 
                      json={'tag': 'Playful'})
    assert rv2.status_code == 403
