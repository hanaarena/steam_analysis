from flask import abort, jsonify
from main import get_game_detail
from . import game_bp

@game_bp.route('/<int:appid>', methods=['GET'])
def game_detail(appid):
    try:
        detail = get_game_detail(appid)
    except Exception as e:
        return abort(500, description=str(e))
    return jsonify(detail)
