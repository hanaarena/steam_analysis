from flask import abort, jsonify, request
from app.game.reviews import fetch_review
from main import get_game_detail, get_first_reviews_stat
from . import game_bp

@game_bp.route('/<int:appid>', methods=['GET'])
def game_detail(appid):
    try:
        detail = get_game_detail(appid)
    except Exception as e:
        return abort(500, description=str(e))
    return jsonify(detail)

@game_bp.route('/reviews/summary/<int:appid>', methods=['GET'])
def game_review_summary(appid):
    """
    Fetch review summary. include reviews amount and stat
    """
    try:
        summary = get_first_reviews_stat(appid)
    except Exception as e:
        return abort(500, description=str(e))
    return jsonify(summary)

@game_bp.route('/reviews/<int:appid>', methods=['GET'])
def game_review_all(appid):
    """
    Fetch review data
    """
    try:
        cursor = request.args.get('cursor', '*')
        review = fetch_review(appid, cursor)
    except Exception as e:
        return abort(500, description=str(e))
    return jsonify(review)
