import json

def group_reviews_by_playtime(reviews_path):
    """
    Group reviews by author's playtime:
    0-1h, 1-2h, 2-5h, 5-10h, 10-20h, 20-50h, 50-100h, >100h
    """
    with open(reviews_path, 'r') as f:
        reviews = json.load(f)
    buckets = {
        '0-1h': [],
        '1-2h': [],
        '2-5h': [],
        '5-10h': [],
        '10-20h': [],
        '20-50h': [],
        '50-100h': [],
        '>100h': []
    }
    for review in reviews:
        playtime_min = review.get('author', {}).get('playtime_forever', 0)
        playtime_hr = playtime_min / 60.0
        if playtime_hr < 1:
            buckets['0-1h'].append(review)
        elif playtime_hr < 2:
            buckets['1-2h'].append(review)
        elif playtime_hr < 5:
            buckets['2-5h'].append(review)
        elif playtime_hr < 10:
            buckets['5-10h'].append(review)
        elif playtime_hr < 20:
            buckets['10-20h'].append(review)
        elif playtime_hr < 50:
            buckets['20-50h'].append(review)
        elif playtime_hr < 100:
            buckets['50-100h'].append(review)
        else:
            buckets['>100h'].append(review)
    return buckets
