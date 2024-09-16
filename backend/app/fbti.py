from flask import jsonify
from pymongo import MongoClient
from app.content_recc import find_nearest_neighbors
from app.simi_score import get_similarity_score
from app.decrypt import money

client = MongoClient('mongodb://localhost:27017/')
db = client['ecommerce']
collection = db['fbtis']
collection1 = db['products']

def count_items(pid, points):
    item_counts = {}
    for document in collection.find({"cartItems": pid}):
        items = document['cartItems']
        for item in items:
            if item != pid:
                score = get_similarity_score(item, pid)
                if item in item_counts:
                    item_counts[item] += 1*score*points
                else:
                    item_counts[item] = 1*score*points
    result = []
    for key, value in item_counts.items():
        product_info = collection1.find_one({"pid": key})
        discounted_price = product_info.get("discounted_price") if product_info else None
        result.append({"pid": key, "similarity_score": value, "discounted_price": discounted_price})
    return result

def count_all(pid, similar):
    money_value = float(money('C001'))
    total_simi_items = count_items(pid, 1)
    combined_items = {}
    
    for item in total_simi_items:
        if item['pid'] not in combined_items:
            combined_items[item['pid']] = {"pid": item['pid'], "similarity_score": item['similarity_score'], "discounted_price": item['discounted_price']}
        else:
            combined_items[item['pid']]['similarity_score'] += item['similarity_score']
    
    if len(combined_items) < 5:
        for item in similar:
            similar_pid = item['pid']
            similar_items = count_items(similar_pid, 0.5)
            
            for similar_item in similar_items:
                if similar_item['pid'] not in combined_items:
                    combined_items[similar_item['pid']] = similar_item
                else:
                    combined_items[similar_item['pid']]['similarity_score'] += similar_item['similarity_score']
    
    overall = []
    final_list = list(combined_items.values())
    seen_pids = set()
    for item in final_list:
        if item['pid'] not in seen_pids and item['pid'] not in [s['pid'] for s in similar] and item['pid'] != pid:
            overall.append(item)
            seen_pids.add(item['pid'])
    
    overall = sorted(overall, key=lambda x: x["similarity_score"], reverse=True)[:5]
    overall.sort(key=lambda x: (abs(x['discounted_price'] - money_value), x['similarity_score']))
    
    return overall


def generate_similar(pid):
    similar = find_nearest_neighbors(pid)
    return jsonify(count_all(pid, similar))
