from flask import Flask, jsonify, abort, request
import requests
from main import get_game_detail
import urllib.parse

app = Flask(__name__)


@app.route('/api/game/<int:appid>', methods=['GET'])
def game_detail(appid):
    try:
        detail = get_game_detail(appid)
    except Exception as e:
        return abort(500, description=str(e))
    return jsonify(detail)

@app.route('/proxy', methods=['GET'])
def proxy_request():
    try: 
        url = request.args.get('url')
        if url is None: abort(404)

        targetUrl = urllib.parse.unquote(url)
        response = requests.get(targetUrl)
        data = response.json()
    except Exception as e:
        return abort(500, description=str(e))
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
