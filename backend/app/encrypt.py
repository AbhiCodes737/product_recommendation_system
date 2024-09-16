from flask import jsonify
import pandas as pd
from cryptography.fernet import Fernet
from pymongo import MongoClient
import os

client = MongoClient('mongodb://localhost:27017')
db = client['ecommerce']
collection = db['accounts']

def encrypt_data(row, cipher_suite):
    encrypted_row = {}
    for col, value in row.items():
        if col in ['cname', 'gender', 'avg_sale', 'password']:
            encrypted_value = cipher_suite.encrypt(str(value).encode())
            encrypted_row[col] = encrypted_value
        else:
            encrypted_row[col] = value
    return encrypted_row

def insert_encrypted_data(df, cipher_suite):
    encrypted_data = [encrypt_data(row, cipher_suite) for _, row in df.iterrows()]
    collection.insert_many(encrypted_data)

def get_or_create_cipher_suite():
    key = Fernet.generate_key()
    print(key)
    cipher_suite = Fernet(key)
    return cipher_suite

def encrypt():
    csv_path = os.path.join(os.path.dirname(os.getcwd()), 'data', 'accounts.csv')
    df = pd.read_csv(csv_path)
    cipher_suite = get_or_create_cipher_suite()
    insert_encrypted_data(df, cipher_suite)
    return jsonify('DB Updated')
