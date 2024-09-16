import pandas as pd
import os

def check_bias(product_category_tree):
  if 'women' in product_category_tree.lower():
    return 'W'
  elif 'men' in product_category_tree.lower():
    return 'M'
  else:
    return 'A'

csv_path = os.path.join(os.path.dirname(os.getcwd()), 'data', 'All Products.csv')
df = pd.read_csv(csv_path)

df['bias'] = df['product_category_tree'].apply(check_bias)
df['sale_percentage'] = (df['retail_price'] - df['discounted_price']) / df['retail_price'] * 100
csv_path = os.path.join(os.path.dirname(os.getcwd()), 'data', 'All Products.csv')
df.to_csv(csv_path, index=False)