import pandas as pd
import random
import re
import os

csv_path = os.path.join(os.path.dirname(os.getcwd()), 'data', 'All Products.csv')
df = pd.read_csv(csv_path)

generated_ids = set()

def generate_product_id(section):
    words = section.split()
    if len(words) == 1:
        section_abbr = section[:2].upper()
    else:
        section_abbr = ''.join(word[:1].upper() for word in words)
    section_abbr = re.sub('&', '', section_abbr)
    while True:
        random_number = str(random.randint(10000, 99999))
        product_id = section_abbr + random_number
        if product_id not in generated_ids:
            generated_ids.add(product_id)
            return product_id

df['pid'] = df['section'].apply(generate_product_id)

df = df[['pid'] + [col for col in df.columns if col != 'pid']]

csv_path = os.path.join(os.path.dirname(os.getcwd()), 'data', 'All Products.csv')
df.to_csv(csv_path, index=False)

print(df.head())