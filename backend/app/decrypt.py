from flask import jsonify
from cryptography.fernet import Fernet
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client['ecommerce']
collection = db['accounts']

def decrypt_data(row, cipher_suite):
    decrypted_row = {}
    for col, value in row.items():
        if col != '_id':
            if col in ['cname', 'gender', 'avg_sale', 'password']:
                if col == 'avg_sale':
                    decrypted_value = float(cipher_suite.decrypt(value).decode())
                else:
                    decrypted_value = cipher_suite.decrypt(value).decode()
                decrypted_row[col] = decrypted_value
            else:
                decrypted_row[col] = value
    return decrypted_row

def money(cid):
    encrypted_data = collection.find_one({'cid': cid})
    if encrypted_data:
        key = b'WHFtaoQ6r2tW2-bau8Am5HPQVW6_VrFzFbXdkqvpo3c='
        cipher_suite = Fernet(key)
        decrypted_data = decrypt_data(encrypted_data, cipher_suite)
        return decrypted_data.get("avg_sale")

def gender_val(cid):
    encrypted_data = collection.find_one({'cid': cid})
    if encrypted_data:
        key = b'WHFtaoQ6r2tW2-bau8Am5HPQVW6_VrFzFbXdkqvpo3c='
        cipher_suite = Fernet(key)
        decrypted_data = decrypt_data(encrypted_data, cipher_suite)
        return decrypted_data.get("gender")

def decrypt(cid):
    encrypted_data = collection.find_one({'cid': cid})
    if encrypted_data:
        key = b'WHFtaoQ6r2tW2-bau8Am5HPQVW6_VrFzFbXdkqvpo3c='
        cipher_suite = Fernet(key)
        decrypted_data = decrypt_data(encrypted_data, cipher_suite)
        return jsonify(decrypted_data)
    else:
        return jsonify({'error': 'Data not found for the provided cid'}), 404
