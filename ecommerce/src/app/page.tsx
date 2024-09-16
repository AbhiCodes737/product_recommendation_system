"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import HomeRec from "@/components/HomeRec";

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

export default function Home() {
  const [homeRecs, setHomeRecs] = useState<string[]>([]);
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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://127.0.0.1:8080/homerec`);
        const data = await response.json();
        setHomeRecs(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    fetchData();
  }, []);

  // Function to get top 5 products randomly
  const getRandomTop5Products = () => {
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  const top5Products = getRandomTop5Products();

  return (
    <div className="flex flex-col justify-center items-center mt-4 mb-4">
      <p className="text-2xl font-semibold">Some Random Products</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-[95%] m-2">
        {top5Products.map((product) => (
          <Link href={`/product/${product.pid}`} key={product._id}>
            <Card product={product} />
          </Link>
        ))}
      </div>
      <hr />
      <p className="text-2xl font-semibold mt-8">Products Recommendations - Your Price Range</p>
      <div className="grid grid-cols-5 gap-4 w-[95%] m-2">
        {homeRecs.map((item) => (
          <Link href={`/product/${item}`} key={item}>
            <HomeRec pid={item} />
          </Link>
        ))}
      </div>
    </div>
  );
}
