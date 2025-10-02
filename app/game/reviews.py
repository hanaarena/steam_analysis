import requests

def fetch_review(appid, cursor='*'):
    """
    Fetch app's review data
    """
    # encode_cursor = urllib.parse.quote(cursor)
    print(f"Fetching review for appid {appid} with cursor {cursor}")
    params = {
      'json':1,
      'language': 'all',
      'filter': 'recent',
      'review_type': 'all',
      'num_per_page': 100,
      'cursor': cursor,
      'day_range': 'null',
      'filter_offtopic_activity': 'null',
      'purchase_type': 'all'
    }
    api = f"https://store.steampowered.com/appreviews/{appid}"
    response = requests.get(api, params=params)
    data = response.json()
    return data