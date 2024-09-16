import { useState, useEffect } from "react";

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
  pid: string;
  similarity_score: number;
}

const RecProduct: React.FC<CardProps> = ({ pid, similarity_score }) => {
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/product/${pid}`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="card border rounded-lg h-full p-2">
      <img
        src={product?.image[0]}
        alt={product?.product_name}
        className="w-[40px] h-[40px]"
      />
      <div className="mt-2 card-content">
        <h3 className="text-sm font-semibold">{product?.product_name}</h3>
        <p className="text-red-500 text-sm font-semibold mt-1">
          Rs.{product?.discounted_price}
        </p>
        {similarity_score !== 0 && (
          <p className="mt-1 text-sm">
            {similarity_score.toString().substring(0, 15)}
          </p>
        )}
      </div>
    </div>
  );
};

export default RecProduct;
