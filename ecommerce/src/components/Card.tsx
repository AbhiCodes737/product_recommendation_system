// components/Card.tsx

import React from "react";

interface Product {
  _id: string;
  pid: string;
  product_name: string;
  product_category_tree: string;
  retail_price: number;
  discounted_price: number;
  image: string[];
  description: string;
  brand: string;
  product_specifications: string;
  section: string;
  category: string;
  subcategory1: string;
  subcategory2: string;
  subcategory3: string;
}

interface CardProps {
  product: Product;
}

const Card: React.FC<CardProps> = ({ product }) => {
  return (
    <div className="card border rounded-lg p-4 h-full">
      <img
        src={product.image[0]}
        alt={product.product_name}
        className="w-[400px] h-[300px]"
      />
      <div className="card-content">
        <h3 className="text-lg font-semibold">{product.product_name}</h3>
        <p className="text-gray-600">{product.brand}</p>
        <p className="text-red-500 font-semibold mt-1">
          Discounted Price: Rs.{product.discounted_price}
        </p>
      </div>
    </div>
  );
};

export default Card;
