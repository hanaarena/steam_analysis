import json
import csv
import re

def export_reviews_to_csv(reviews_path, csv_path):
    """
    Export reviews from JSON to CSV
    """
    selected_fields = [
        'steamid', 'num_games_owned', 'num_reviews', 'playtime_forever',
        'language', 'review', 'timestamp_created', 'voted_up'
    ]
    with open(reviews_path, 'r') as f:
        reviews = json.load(f)
    if not reviews:
        print("No reviews to export.")
        return
    with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=selected_fields)
        writer.writeheader()
        for review in reviews:
            author = review.get('author', {})
            raw_review = review.get('review', '')
            clean_review = re.sub(r'[\r\n\t]+', ' ', raw_review).strip()
            filtered_review = {
                'steamid': author.get('steamid', ''),
                'num_games_owned': author.get('num_games_owned', ''),
                'num_reviews': author.get('num_reviews', ''),
                'playtime_forever': author.get('playtime_forever', ''),
                'language': review.get('language', ''),
                'review': clean_review,
                'timestamp_created': review.get('timestamp_created', ''),
                'voted_up': review.get('voted_up', ''),
            }
            writer.writerow(filtered_review)
    print(f"Exported {len(reviews)} reviews to {csv_path}")
