"use client";

import AddToCartBtn from "@/components/AddToCartBtn";
import RecProduct from "@/components/RecProduct";
import Link from "next/link";
import { useEffect, useState } from "react";

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

interface Recommendations {
  pid: string;
  similarity_score: number;
}

const ProductPage = ({ params }: { params: { pid: string } }) => {
  const [product, setProduct] = useState<Product>();
  const [bias, setBias] = useState<boolean>(false);
  const [sale, setSale] = useState<boolean>(false);
  const [contentRecs, setContentRecs] = useState<Recommendations[]>([]);
  const [similarRecs, setSimilarRecs] = useState<Recommendations[]>([]);
  const [contextRecs, setContextRecs] = useState<Recommendations[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/product/${params.pid}`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let apiUrl;
        if (sale) {
          apiUrl = `http://127.0.0.1:8080/recommend_sale/${params.pid}`;
        } else {
          apiUrl = `http://127.0.0.1:8080/recommend/${params.pid}`;
        }
        const response = await fetch(apiUrl);
        const data = await response.json();
        setContentRecs(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    fetchData();
  }, [sale]);

  useEffect(() => {
    async function fetchData() {
      try {
        let apiUrl;
        if (bias) {
          if (sale) {
            apiUrl = `http://127.0.0.1:8080/similar_bias_sale/${params.pid}`;
          } else {
            apiUrl = `http://127.0.0.1:8080/similar_bias/${params.pid}`;
          }
        } else {
          if (sale) {
            apiUrl = `http://127.0.0.1:8080/similar_sale/${params.pid}`;
          } else {
            apiUrl = `http://127.0.0.1:8080/similar/${params.pid}`;
          }
        }
        const response = await fetch(apiUrl);
        const data = await response.json();
        setSimilarRecs(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    fetchData();
  }, [bias, sale]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8080/context_prod/${params.pid}`
        );
        const data = await response.json();
        setContextRecs(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    fetchData();
  }, []);

  const discountPercentage = product
    ? Math.round(
        ((product.retail_price - product.discounted_price) /
          product.retail_price) *
          100
      )
    : 0;

  function shuffleArray<T>(array: T[]): T[] {
    const newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  let allRecs: Recommendations[] = contentRecs
    .concat(similarRecs)
    .concat(contextRecs);
  const uniquePids = Array.from(new Set(allRecs.map((item) => item.pid)));

  const uniqueRecs = allRecs.filter(
    (item, index) => allRecs.findIndex((i) => i.pid === item.pid) === index
  );
  const sRecs = uniqueRecs.filter((item) => item.pid !== product?.pid);

  const shuffledRecs = shuffleArray(sRecs);

  return (
    <>
      <div className="p-4 flex flex-row">
        <img
          src={product?.image[0]}
          alt={product?.product_name}
          className="w-1/3 h-1/3"
        />
        <div className="mt-2 p-20">
          <h3 className="text-lg font-semibold">{product?.product_name}</h3>
          <hr />
          <p className="text-gray-600">Brand: {product?.brand}</p>
          <p className="text-gray-600">{product?.product_category_tree}</p>
          <hr />
          <p className="text-gray-600">{product?.description}</p>
          <hr />

          <hr />
          {discountPercentage === 0 ? (
            <div className="flex flex-row gap-4">
              <p className="text-black">Price: </p>
              <p className="text-red-500 font-semibold text-xl">
                Rs.{product?.retail_price}
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-row gap-4">
                <p className="text-black">Price: </p>
                <p className="text-gray-600 line-through">
                  Rs.{product?.retail_price}
                </p>
              </div>
              <div className="ml-[3.75rem] flex flex-row gap-2">
                <p className="text-red-500 font-semibold mt-1 text-2xl">
                  Rs.{product?.discounted_price}
                </p>
                <p className="text-gray-600 border border-gray-600 rounded-md align-middle pt-[0.375rem] px-1">
                  {discountPercentage}% Off
                </p>
              </div>
            </>
          )}
          <div className="flex content-start my-8">
            <AddToCartBtn product={product!} />
          </div>
          <button
            className={
              bias
                ? "bg-green-500 p-2 rounded-lg mr-4"
                : "bg-red-500 p-2 rounded-lg text-white mr-4"
            }
            onClick={() => setBias(!bias)}
          >
            Bias
          </button>
          <button
            className={
              sale
                ? "bg-green-500 p-2 rounded-lg"
                : "bg-red-500 p-2 rounded-lg text-white"
            }
            onClick={() => setSale(!sale)}
          >
            Sale
          </button>
        </div>
      </div>
      <div className="flex flex-col ml-4 mb-4">
        <div className="flex flex-row gap-8">
          <div className="w-[45%] flex flex-col">
            <p className="text-xl font-semibold">Similar Items</p>
            <div className="grid grid-cols-5 gap-1 mt-1">
              {contentRecs.map((item) => (
                <Link href={`/product/${item.pid}`}>
                  <RecProduct
                    key={item.pid}
                    pid={item.pid}
                    similarity_score={item.similarity_score}
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="w-[45%] flex flex-col">
            <p className="text-xl font-semibold">Users Also Bought</p>
            <div className="grid grid-cols-5 gap-1 mt-1">
              {similarRecs.map((item) => (
                <Link href={`/product/${item.pid}`}>
                  <RecProduct
                    key={item.pid}
                    pid={item.pid}
                    similarity_score={item.similarity_score}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="w-[92%] flex flex-col mt-2">
          <p className="text-xl font-semibold">All Recommendations</p>
          <div className="grid grid-cols-10 gap-1 mt-1">
            {shuffledRecs.map((item) => (
              <Link href={`/product/${item.pid}`}>
                <RecProduct
                  key={item.pid}
                  pid={item.pid}
                  similarity_score={0}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
