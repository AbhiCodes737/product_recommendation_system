from flask import jsonify
from pymongo import MongoClient
from app.content_recc import find_nearest_neighbors
from app.simi_score import get_similarity_score
from app.decrypt import money

client = MongoClient('mongodb://localhost:27017/')
db = client['ecommerce']
collection = db['products']

def home_rec():
    money_value = money('C001')
    products = collection.find({}, {'pid': 1, 'discounted_price': 1})

    differences = {}
    for product in products:
        pid = product['pid']
        discounted_price = product['discounted_price']
        absolute_difference = abs(discounted_price - money_value)
        differences[pid] = absolute_difference

    sorted_differences = sorted(differences.items(), key=lambda x: x[1])
    top_5_products = sorted_differences[:5]

    top_5_products_details = []
    for pid, _ in top_5_products:
        top_5_products_details.append(pid)
    print(top_5_products_details)
    return jsonify(top_5_products_details)