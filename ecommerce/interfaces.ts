export interface Product {
  _id: string;
  pid: string;
  product_name: string;
  product_category_tree: string;
  retail_price: number;
  discounted_price: number;
  image: string[];
  description: string;
  brand: string;
  product_specifications: object;
  section: string;
  category: string;
  subcategory1: string;
  subcategory2: string;
  subcategory3: string;
}
export interface CartItem {
  product: Product;
  qty: number;
}
