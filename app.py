import os
from flask import Flask
from extensions import db, cache, login_manager
from models import User

def create_app(test_config=None):
    app = Flask(__name__)

    # Default Configuration
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev_secret_nsac_2026'),
        SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL', 'sqlite:///campus.db'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        CACHE_TYPE='SimpleCache',
        CACHE_DEFAULT_TIMEOUT=300,
    )

    if test_config:
        app.config.update(test_config)

    # Initialize Extensions
    db.init_app(app)
    cache.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(User, int(user_id))

    # Blueprint Registration Stubs
    from blueprints.auth import auth_bp; app.register_blueprint(auth_bp)
    from blueprints.public import public_bp; app.register_blueprint(public_bp)
    from blueprints.admin import admin_bp; app.register_blueprint(admin_bp)
    from blueprints.api import api_bp; app.register_blueprint(api_bp)

    @app.cli.command("init-db")
    def init_db():
        """Clear existing data and create new tables."""
        db.create_all()
        print("Initialized the database.")

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
