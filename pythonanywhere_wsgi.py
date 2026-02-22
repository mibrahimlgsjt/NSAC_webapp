# This file contains the WSGI configuration required to serve up your
# web application at http://<your-username>.pythonanywhere.com/
# It works by setting the variable 'application' to a WSGI handler of some
# description.

import sys
import os

# The path to your project directory
# REPLACE 'yourusername' with your actual PythonAnywhere username!
project_home = '/home/yourusername/mysite'

if project_home not in sys.path:
    sys.path.append(project_home)

# Set environment variables if needed (e.g., SECRET_KEY)
# os.environ['SECRET_KEY'] = 'your-secret-key'

# Import the Flask app
from app import app as application
