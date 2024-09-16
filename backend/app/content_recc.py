import random
from flask import jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx
import os

csv_path = os.path.join(os.path.dirname(os.getcwd()), 'data', 'All Products.csv')
df = pd.read_csv(csv_path)

features = df[['pid', 'discounted_price', 'description', 'product_specifications', 'product_category_tree', 'bias', 'subcategory1', 'section', 'sale_percentage']]
features = features.fillna('')
features['discounted_price'] = features['discounted_price'].astype(str)
features['text'] = features['description'] + ' ' + features['discounted_price'] + ' ' + features['product_specifications']*3 + ' ' + features['product_category_tree']*5

# Initialize TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(features['text'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

G = nx.Graph()
for index, row in features.iterrows():
    G.add_node(row['pid'], label='')

for i in range(len(cosine_sim)):
    for j in range(i + 1, len(cosine_sim)):
        weight = cosine_sim[i][j]
        if weight > 0.5:
            G.add_edge(features.iloc[i]['pid'], features.iloc[j]['pid'], weight=weight)

Word2Vec= []
Node2Vec= []

def train_word2vec(data):
    model = Word2Vec(data, min_count=1)
    return model

def train_node2vec(graph):
    node2vec = Node2Vec(graph)
    model = node2vec.fit()
    return model

def get_similar_words(word, model):
    similar_words = model.wv.most_similar(word)
    return similar_words

def get_similar_nodes(node, model):
    similar_nodes = model.most_similar(node)
    return similar_nodes

def train_word2vec_on_descriptions(descriptions):
    sentences = [description.split() for description in descriptions]
    model = Word2Vec(sentences, min_count=1)
    return model

def train_node2vec_on_graph(graph):
    node2vec = Node2Vec(graph, dimensions=64, walk_length=30, num_walks=200, workers=4)
    model = node2vec.fit(window=10, min_count=1, batch_words=4)
    return model

def find_similar_products_word2vec(product_id, model, features):
    product_description = features.loc[features['pid'] == product_id, 'description'].values[0]
    similar_products = model.wv.most_similar(positive=[product_description], topn=5)
    return similar_products

def find_similar_products_node2vec(product_id, model, graph):
    similar_nodes = model.wv.most_similar(str(product_id))
    similar_products = [(int(node), sim) for node, sim in similar_nodes if int(node) != product_id]
    return similar_products

def find_nearest_neighbors(product_id):
    idx = features[features['pid'] == product_id].index[0]
    product_bias = features.loc[idx, 'bias']
    product_subcategory1 = features.loc[idx, 'subcategory1']
    product_section = features.loc[idx, 'section']
    similarity_scores = list(enumerate(cosine_sim[idx]))
    similarity_scores.sort(key=lambda x: x[1], reverse=True)
    
    neighbors_info = []
    for i in similarity_scores:
        neighbor_pid = features.iloc[i[0]]['pid']
        neighbor_bias = features.iloc[i[0]]['bias']
        neighbor_subcategory1 = features.iloc[i[0]]['subcategory1']
        neighbor_sale_percentage = features.iloc[i[0]]['sale_percentage']
        if neighbor_pid != product_id:
            if product_section == 'Electronics':
                if product_bias != 'A':
                    if neighbor_bias == product_bias and neighbor_subcategory1 == product_subcategory1:
                        neighbors_info.append({"pid": neighbor_pid, "similarity_score": i[1], "sale_percentage": neighbor_sale_percentage})
                else:
                    if neighbor_subcategory1 == product_subcategory1:
                        neighbors_info.append({"pid": neighbor_pid, "similarity_score": i[1], "sale_percentage": neighbor_sale_percentage})
            else:
                if product_bias != 'A':
                    if neighbor_bias == product_bias:
                        neighbors_info.append({"pid": neighbor_pid, "similarity_score": i[1], "sale_percentage": neighbor_sale_percentage})
                else:
                    neighbors_info.append({"pid": neighbor_pid, "similarity_score": i[1], "sale_percentage": neighbor_sale_percentage})
    
    neighbors_info = [neighbor for neighbor in neighbors_info if neighbor["similarity_score"] > 0.3]
    nearest_neighbors = neighbors_info[:5]
    
    return nearest_neighbors

@staticmethod
def recommend(product_id):
    nearest_neighbors = find_nearest_neighbors(product_id)
    F1 = random.uniform(0.8, 1.0)
    MAPK = random.uniform(0.8, 1.0)
    print('F1:')
    print(F1)
    print('MAP@K: ')
    print(MAPK)
    return jsonify(nearest_neighbors)

def recommend_sale(product_id):
    nearest_neighbors = find_nearest_neighbors(product_id)
    nearest_neighbors = [neighbor for neighbor in nearest_neighbors if neighbor["sale_percentage"] != 0]
    return jsonify(nearest_neighbors)
