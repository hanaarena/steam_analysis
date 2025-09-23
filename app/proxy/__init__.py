from flask import Blueprint

proxy_bp = Blueprint('proxy', __name__)

# Import routes to register them with the blueprint
from . import routes