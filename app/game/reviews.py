import urllib
import requests

def fetch_review(appid, cursor='*'):
    """
    Fetch app's review data
    """
    encode_cursor = urllib.parse.quote(cursor)
    print(f"Fetching review for appid {appid} with cursor {encode_cursor}")
    api = f"https://store.steampowered.com/appreviews/{appid}?json=1&language=all&filter=recent&review_type=all&num_per_page=100&cursor={encode_cursor}&day_range=null&purchase_type=all&filter_offtopic_activity=null&l=english"
    response = requests.get(api)
    data = response.json()
    result = {
      "reviews": [],
      "cursor": '*'
    }
    result['reviews'] = data.get('reviews', [])
    result['cursor'] = data.get('cursor', '*')
    return result