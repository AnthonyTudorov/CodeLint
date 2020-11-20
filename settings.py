'''Setting up basic config for out db'''
import os
import flask
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

load_dotenv()
app = flask.Flask(__name__)

database_url = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.getenv('APP_SECRET')
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Strict'
db = SQLAlchemy(app)
db.app = app
