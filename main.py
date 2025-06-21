import requests
import time
import json
import os

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

appid = 570
reviews_json = fetch_reviews(appid, max_reviews=200)
print(f"Fetched {len(reviews_json)} reviews")

# Save the reviews to a JSON file to folder data/reviews
os.makedirs("data/reviews", exist_ok=True)
with open(f"data/reviews/reviews_{appid}.json", "w") as f:
    json.dump(reviews_json, f, indent=2)
