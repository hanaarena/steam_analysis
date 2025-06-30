import json
from collections import defaultdict

def rate_by_language(reviews_path):
    """
    Calculate the positive/negative rate of reviews for each language/country.
    """
    with open(reviews_path, 'r') as f:
        reviews = json.load(f)
    stats = defaultdict(lambda: {'positive': 0, 'negative': 0, 'total': 0})
    for review in reviews:
        lang = review.get('language', 'unknown')
        if review.get('voted_up', False):
            stats[lang]['positive'] += 1
        else:
            stats[lang]['negative'] += 1
        stats[lang]['total'] += 1
    for lang, d in stats.items():
        total = d['total']
        d['positive_rate'] = d['positive'] / total if total else 0
        d['negative_rate'] = d['negative'] / total if total else 0
    return stats
