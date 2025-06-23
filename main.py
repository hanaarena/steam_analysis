import requests
import time
import json
import os
from collections import defaultdict
import re

appid = 570
language_map = {
    "spanish": "spanish - spain",
    "tchinese": "traditional chinese",
    "schinese": "simplified chinese",
    "latam": "spanish - latin america",
    "brazilian": "portuguese - brazil"
}

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

def get_supported_languages(appid):
    """
    Fetch supported languages list
    """
    api = f"https://store.steampowered.com/api/appdetails?appids={appid}&l=english"
    response = requests.get(api)
    data = response.json()
    app_data = data.get(str(appid), {}).get('data', {})
    languages_str = app_data.get('supported_languages', '')
    # clean up the string
    languages_str_clean = re.sub('<[^>]*>[^<]*<\\/[^>]*>', '', languages_str)
    languages_str_clean = re.sub('<.*?>', '', languages_str_clean)
    languages_str_clean = languages_str_clean.replace('languages with full audio support', '')
    langs = [lang.strip() for lang in languages_str_clean.split(',') if lang.strip()]
    return langs

reviews_json = fetch_reviews(appid, max_reviews=200)
print(f"Fetched {len(reviews_json)} reviews")

# Save the reviews to a JSON file to folder data/reviews
os.makedirs("data/reviews", exist_ok=True)
reviews_path = f"data/reviews/reviews_{appid}.json"
with open(reviews_path, "w") as f:
    json.dump(reviews_json, f, indent=2)

supported_languages = get_supported_languages(appid)
print(f"Supported languages: {supported_languages}")
country_reviews = group_reviews_by_country(reviews_path)

for country, reviews in country_reviews.items():
    def normalize(lang):
        return lang.replace('-', '').replace(' ', '').lower()
    mapped_country = language_map.get(country, country)
    country_norm = normalize(mapped_country)
    supported_norms = [normalize(l) for l in supported_languages]
    mark = '✅' if country_norm in supported_norms else '❌'
    print(f"Language: {country} {mark}, Review Count: {len(reviews)}")
