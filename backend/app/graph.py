import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx
import matplotlib.pyplot as plt

df = pd.read_csv('/content/drive/MyDrive/Final Review/All Products.csv')

features = df[['pid', 'discounted_price', 'description', 'product_specifications', 'product_category_tree', 'bias']]

features = features.fillna('')

features['discounted_price'] = features['discounted_price'].astype(str)

features['text'] = features['description'] + ' ' + features['discounted_price'] + ' ' + features['product_specifications'] + ' ' + features['product_category_tree']

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

plt.figure(figsize=(12, 8))
nx.draw(G, node_size=10, node_color='skyblue', edge_color='gray', with_labels=True)
plt.title('Product Recommendation Graph')
plt.show()

def find_nearest_neighbors(product_id):
    idx = features[features['pid'] == product_id].index[0]
    similarity_scores = list(enumerate(cosine_sim[idx]))
    similarity_scores.sort(key=lambda x: x[1], reverse=True)
    nearest_neighbors = similarity_scores[1:6]
    neighbors_info = []
    for i in nearest_neighbors:
        neighbor_pid = features.iloc[i[0]]['pid']
        neighbor_name = df[df['pid'] == neighbor_pid]['product_name'].values[0]
        neighbors_info.append((neighbor_pid, neighbor_name))
    return neighbors_info

product_id = 'EL18693'
nearest_neighbors = find_nearest_neighbors(product_id)
print("5 Nearest Neighbors of Product", product_id, ":")
for pid, name in nearest_neighbors:
    print("Product ID:", pid, "| Product Name:", name)