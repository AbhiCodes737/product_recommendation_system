from flask import jsonify
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['ecommerce']
collection1 = db['products']
collection2 = db['tags']

def find_products_by_keywords(product_id, keywords):
    product = collection1.find_one({"pid": product_id})
    if product:
        description = product.get('description', '').lower()
        name = product.get('product_name', '').lower()
        product_category_tree = product.get('product_category_tree', '').lower()

        for keyword in keywords:
            if (keyword in description or
                keyword in name or
                keyword in product_category_tree):
                return keyword
    return None

def find_products(product_id):
    keywords = ["office", "sports", "food"]
    keyword = find_products_by_keywords(product_id, keywords)
    result = collection2.find_one({"tag": keyword})
    if result:
        products = result.get('products', [])
        recommendations = []
        for product in products:
            recommendations.append({
                "pid": product['pid'],
                "similarity_score": 0
            })
        return jsonify(recommendations)
    return jsonify([])