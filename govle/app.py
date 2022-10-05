# Main application file for GoVLê
from os import environ, path

import firebase_admin
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from dotenv import find_dotenv, load_dotenv
from firebase_admin import credentials, db
from flask import Flask, redirect, request, url_for
from flask_login import LoginManager

from govle.controllers import init_api
from govle.controllers.database import Database
from govle.models.profile import Profile
from govle.views import init_views

# Environment variables
load_dotenv()

# Flask app
root_path = path.abspath(path.join(path.dirname(__file__), '..'))
app = Flask(__name__, root_path=root_path)

# Authentication
if 'FLASK_SECRET_KEY' not in environ:
    raise RuntimeError('FLASK_SECRET_KEY environment variable not set')
app.secret_key = environ['FLASK_SECRET_KEY']
login_manager = LoginManager()
login_manager.init_app(app)

# Firebase: Database URL is required
if 'FIREBASE_DATABASE_URL' not in environ:
    raise RuntimeError('FIREBASE_DATABASE_URL environment variable not set')

# Firebase: Parse credentials.json (not in tree, must be supplied)
cred = credentials.Certificate('credentials.json')

# Firebase: Initialize and get database root ref
firebase_admin.initialize_app(cred, {
    'databaseURL': environ['FIREBASE_DATABASE_URL']
})
app.config['DB'] = Database(db.reference())

# RSA cipher for decrypting credentials
with open('priv.pem', 'rb') as priv_key_file:
    app.config['RSA_CIPHER'] = serialization.load_pem_private_key(
        priv_key_file.read(),
        password=None,
        backend=default_backend())

# User loader
@login_manager.user_loader
def user_loader(user_id: str) -> Profile:
    return app.config['DB'].lookup_user_by_id(user_id)

# Unauthorized error handler
@login_manager.unauthorized_handler
def unauthorized_handler():
    return redirect(url_for('login.login_page') + '?next=' + request.path)

# Routes
init_views(app)
init_api(app)

# Run app
if __name__ == '__main__':
    app.run(debug=True)
