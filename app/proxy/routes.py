import urllib
from flask import abort, jsonify, request
import requests
from . import proxy_bp

@proxy_bp.route('/', methods=['GET'])
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