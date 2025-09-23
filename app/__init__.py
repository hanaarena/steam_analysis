from flask import Flask

def create_app():
    app = Flask(__name__)

    # Register blueprints
    from .proxy import proxy_bp
    app.register_blueprint(proxy_bp, url_prefix='/proxy')
    from .game import game_bp
    app.register_blueprint(game_bp, url_prefix='/api/game')

    return app