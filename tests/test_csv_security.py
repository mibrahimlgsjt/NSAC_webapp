import unittest
import csv
import io
from app import app, db
from models import User, Animal, MedicalLog
from werkzeug.security import generate_password_hash

class TestCSVSecurity(unittest.TestCase):
    def setUp(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()

        db.create_all()

        # Create admin user
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', password_hash=generate_password_hash('password'), role='admin')
            db.session.add(admin)

        # Create animal with malicious name
        animal = Animal(name="=TestAnimal", current_sector="Sector1")
        db.session.add(animal)
        db.session.commit()

        # Create malicious medical log
        malicious_condition = "=cmd|' /C calc'!A0"
        log = MedicalLog(
            animal_id=animal.id,
            condition=malicious_condition,
            clinic_name="@SUM(1+1)",
            rescuer_name="+malicious"
        )
        db.session.add(log)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def login(self, username, password):
        return self.app.post('/login', data=dict(
            username=username,
            password=password
        ), follow_redirects=True)

    def test_csv_injection_prevention(self):
        # Login as admin
        self.login('admin', 'password')

        response = self.app.get('/admin/export/logs')
        self.assertEqual(response.status_code, 200)

        content = response.data.decode('utf-8')
        csv_reader = csv.reader(io.StringIO(content))
        header = next(csv_reader)
        row = next(csv_reader)

        # The fields are: Date, Animal, Condition, Clinic, Cost, Rescuer, Release Date
        # Index 1 is Animal
        # Index 2 is Condition
        # Index 3 is Clinic
        # Index 5 is Rescuer

        animal_name = row[1]
        condition = row[2]
        clinic = row[3]
        rescuer = row[5]

        print(f"Animal: {animal_name}")
        print(f"Condition: {condition}")
        print(f"Clinic: {clinic}")
        print(f"Rescuer: {rescuer}")

        # Assert that fields DO NOT start with dangerous characters
        self.assertFalse(animal_name.startswith("="), "Animal Name field is vulnerable to CSV injection")
        self.assertFalse(condition.startswith("="), "Condition field is vulnerable to CSV injection")
        self.assertFalse(clinic.startswith("@"), "Clinic field is vulnerable to CSV injection")
        self.assertFalse(rescuer.startswith("+"), "Rescuer field is vulnerable to CSV injection")

        # Verify proper escaping (assuming we use single quote prefix)
        self.assertTrue(animal_name.startswith("'="), "Animal Name field was not properly escaped")
        self.assertTrue(condition.startswith("'="), "Condition field was not properly escaped")
        self.assertTrue(clinic.startswith("'@"), "Clinic field was not properly escaped")
        self.assertTrue(rescuer.startswith("'+"), "Rescuer field was not properly escaped")

if __name__ == '__main__':
    unittest.main()
