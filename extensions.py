from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
from flask_login import LoginManager
from utils.bloom_filter import SimpleBloomFilter

db = SQLAlchemy()
cache = Cache()
login_manager = LoginManager()
vote_bloom = SimpleBloomFilter(size=10000, hash_count=7)
