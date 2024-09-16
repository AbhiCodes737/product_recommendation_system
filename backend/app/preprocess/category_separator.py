import pandas as pd
import os

csv_path = os.path.join(os.path.dirname(os.getcwd()), 'data', 'All Products.csv')
df = pd.read_csv(csv_path)

df['product_category_tree'] = df['product_category_tree'].str.replace(r'\[|\]', '').str.replace('"', '')

categories = df['product_category_tree'].str.split('>>')

for i in range(len(categories)):
    for j in range(len(categories[i])):
        column_name = f'subcategory{j}'
        if column_name not in df.columns:
            df[column_name] = ''
        df.at[i, column_name] = categories[i][j].strip()

df.rename(columns={'subcategory0': 'section', 'subcategory1': 'category'}, inplace=True)

for i in range(2, len(df.columns)):
    df.rename(columns={f'subcategory{i-1}': f'subcategory{i-2}'}, inplace=True)

df = df[df['category'] != '']

print("Modified DataFrame:")
print(df)

csv_path = os.path.join(os.path.dirname(os.getcwd()), 'data', 'All Products.csv')
df.to_csv(csv_path, index=False)