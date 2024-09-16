import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

csv_path = os.path.join(os.path.dirname(os.getcwd()), 'data', 'All Products.csv')
df = pd.read_csv(csv_path)

features = df[['pid', 'description', 'discounted_price', 'product_specifications', 'section', 'category', 'subcategory1', 'subcategory2', 'subcategory3', 'subcategory4']]
features = features.fillna('')
features['discounted_price'] = features['discounted_price'].astype(str)
features['text'] = features['description'] + ' ' + features['discounted_price'] + ' ' + features['product_specifications'] + ' ' + features['section'] + ' ' + features['category'] + ' ' + features['subcategory1'] + ' ' + features['subcategory2'] + ' ' + features['subcategory3'] + ' ' + features['subcategory4']

# Initialize TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(features['text'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

def get_similarity_score(pid1, pid2):
    idx1 = features[features['pid'] == pid1].index[0]
    idx2 = features[features['pid'] == pid2].index[0]
    return cosine_sim[idx1][idx2]
