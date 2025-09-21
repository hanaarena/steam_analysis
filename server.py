from flask import Flask, jsonify, abort
from main import get_game_detail

app = Flask(__name__)


@app.route('/api/game/<int:appid>', methods=['GET'])
def game_detail(appid):
    try:
        detail = get_game_detail(appid)
    except Exception as e:
        return abort(500, description=str(e))
    return jsonify(detail)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
