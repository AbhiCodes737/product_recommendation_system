from app import app
from app.content_recc import recommend, recommend_sale
from app.fbti import generate_similar
from app.fbti_bias import generate_similar_bias
from app.encrypt import encrypt
from app.decrypt import decrypt
from app.fbti_bias_sale import generate_similar_bias_sale
from app.fbti_sale import generate_similar_sale
from app.home import home_rec
from app.tag import find_products

@app.route('/recommend/<product_id>')
def recommend_api(product_id):
    return recommend(product_id)

@app.route('/recommend_sale/<product_id>')
def recommend_api_sale(product_id):
    return recommend_sale(product_id)

@app.route('/similar/<product_id>')
def similar_api(product_id):
    return generate_similar(product_id)

@app.route('/similar_bias/<product_id>')
def similar_api_bias(product_id):
    return generate_similar_bias(product_id)

@app.route('/similar_sale/<product_id>')
def similar_api_sale(product_id):
    return generate_similar_sale(product_id)

@app.route('/similar_bias_sale/<product_id>')
def similar_api_bias_sale(product_id):
    return generate_similar_bias_sale(product_id)

@app.route('/context_prod/<product_id>')
def contextapi(product_id):
    return find_products(product_id)

@app.route('/encrypt', methods=['POST'])
def encrypt_api():
    return encrypt()

@app.route('/decrypt/<cid>')
def decrypt_api(cid):
    return decrypt(cid)

@app.route('/homerec')
def homerec_api():
    return home_rec()
