from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_mail import Mail
from flask_cors import CORS
from celery import Celery

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = '57916998bb0b13ce0c676dfde280ba245'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'baazsingh1708@gmail.com'
app.config['MAIL_PASSWORD'] = 'qdqxuqfvfwqjvsgm'
mail = Mail(app)
app.config["CELERY_BROKER_URL"] = "redis://localhost:6379/1"
app.config["CELERY_RESULT_BACKEND"] = "redis://localhost:6379/2"
celery = Celery(app.name,broker=app.config["CELERY_BROKER_URL"],result_backend=app.config["CELERY_RESULT_BACKEND"]) 

from flask_api.errors.handlers import errors
app.register_blueprint(errors)

app.app_context().push()

from flask_api import routes