import requests
import time
import json
import os
from collections import defaultdict
import re
import urllib

import language_constants
import playtime_analysis
import review_rate
import export_utils

appid = 570
game_info = {
    'supported_languages': [],
    'info': {},
    'reviews_summary': {}
}
all_reviews = []
reviews_path = f"data/reviews/reviews_{appid}.json"

def fetch_reviews(appid, max_reviews=100):
    """Fetch Steam reviews with appid """
    url = f"https://store.steampowered.com/appreviews/{appid}"
    params = {
        "json": 1,
        "filter": "recent",       
        "language": "all",       
        "purchase_type": "all",  
        "num_per_page": 100      
    }
    reviews = []
    cursor = "*"
    while len(reviews) < max_reviews:
        params["cursor"] = cursor
        response = requests.get(url, params=params)
        data = response.json()
        batch = data.get("reviews", [])
        if not batch:
            break
        reviews.extend(batch)
        cursor = data.get("cursor", "")
        if not cursor or len(batch)==0:
            break
        time.sleep(1)  
    return reviews

def group_reviews_by_country(reviews_path):
    """
    Group by reviews by language
    Returns a dict: {[language]: [review, ...]}
    """
    with open(reviews_path, 'r') as f:
        reviews = json.load(f)
    country_reviews = defaultdict(list)
    for review in reviews:
        lang = review.get('language', 'unknown')
        country_reviews[lang].append(review)
    return country_reviews

def get_game_detail(appid):
    """
    Fetch supported languages list
    """
    api = f"https://store.steampowered.com/api/appdetails?appids={appid}&l=english"
    response = requests.get(api)
    data = response.json()
    app_data = data.get(str(appid), {}).get('data', {})
    languages_str = app_data.get('supported_languages', '')
    # clean up the language string
    languages_str_clean = re.sub('<[^>]*>[^<]*<\\/[^>]*>', '', languages_str)
    languages_str_clean = re.sub('<.*?>', '', languages_str_clean)
    languages_str_clean = languages_str_clean.replace('languages with full audio support', '')
    langs = [lang.strip() for lang in languages_str_clean.split(',') if lang.strip()]
    return {
        'languages': langs,
        'info': {
            'appid': app_data.get('steam_appid', ''),
            'name': app_data.get('name', ''),
            'developer': app_data.get('developers', []),
            'publisher': app_data.get('publishers', []),
            'release_date': app_data.get('release_date', {}).get('date', ''),
            'header_image': app_data.get('header_image', ''),
            'background': app_data.get('background', '')
        }
    }

# reviews_json = fetch_reviews(appid, max_reviews=200)
# print(f"Fetched {len(reviews_json)} reviews")

def get_first_reviews_stat(appid, cursor='*'):
    """
    Get all reviews summary data
    """
    print(f"Fetching reviews summary for appid {appid} with cursor {cursor}")
    api = f"https://store.steampowered.com/appreviews/{appid}?json=1&language=all&filter=recent&review_type=all&num_per_page=100&cursor={cursor}&day_range=null&purchase_type=all&filter_offtopic_activity=null&l=english"
    response = requests.get(api)
    data = response.json()
    game_info['reviews_summary'] = data.get('query_summary', {})
    return data.get('cursor', '*')

def fetch_all_reviews_stat(appid, cursor='*', max_pages=50):
    """
    Loop get_all_reviews_stat 50 times, using the cursor for pagination.
    """
    for _ in range(1, max_pages):
        encode_cursor = urllib.parse.quote(cursor)
        print(f"Fetching reviews summary for appid {appid} with cursor {encode_cursor}(page: {_+1}/{max_pages})")
        api = f"https://store.steampowered.com/appreviews/{appid}?json=1&language=all&filter=recent&review_type=all&num_per_page=100&cursor={encode_cursor}&day_range=null&purchase_type=all&filter_offtopic_activity=null&l=english"
        response = requests.get(api)
        data = response.json()
        reviews_data = data.get('reviews', {})
        all_reviews.append(reviews_data)
        new_cursor = data.get('cursor', None)
        if not new_cursor or new_cursor == cursor:
            print(f"No more reviews to fetch. Current cursor: {encode_cursor}, {data}")
            break
        cursor = new_cursor
        time.sleep(2)
    with open(reviews_path, "w") as f:
        flat_reviews = [review for batch in all_reviews for review in batch]
        json.dump(flat_reviews, f, indent=2)

def get_all_reviews():
    cursor = get_first_reviews_stat(appid)
    fetch_all_reviews_stat(appid, cursor)

os.makedirs("data/reviews", exist_ok=True)
os.makedirs("data/output", exist_ok=True)

game_detail = get_game_detail(appid)
game_info['supported_languages'] = game_detail.get('languages', [])
game_info['info'] = game_detail.get('info', [])
print(f"Supported languages: {game_info['supported_languages']}")
print(f"Game infomation: {game_info['info']}")
country_reviews = group_reviews_by_country(reviews_path)

for country, reviews in country_reviews.items():
    def normalize(lang):
        return lang.replace('-', '').replace(' ', '').lower()
    mapped_country = language_constants.language_mapping.get(country, country)
    country_norm = normalize(mapped_country)
    supported_norms = [normalize(l) for l in game_info['supported_languages']]
    mark = '✅' if country_norm in supported_norms else '❌'
    print(f"Language: {country} {mark}, Review Count: {len(reviews)}")

get_all_reviews()

buckets = playtime_analysis.group_reviews_by_playtime(reviews_path)
for k, v in buckets.items():
    print(f"{k}: {len(v)} reviews")

rates = review_rate.rate_by_language(reviews_path)
for lang, stat in rates.items():
    print(f"{lang}: 👍+{stat['positive']} 👎 -{stat['negative']} (total {stat['total']}) | rate: {stat['positive_rate']:.2%}")

csv_path = f"data/output/reviews_{appid}.csv"
export_utils.export_reviews_to_csv(reviews_path, csv_path)