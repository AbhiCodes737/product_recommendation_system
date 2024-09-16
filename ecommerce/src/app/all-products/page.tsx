"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";

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

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-[95%] m-2">
        {products.map((product) => (
          <Link href={`/product/${product.pid}`}>
            <Card key={product._id} product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
