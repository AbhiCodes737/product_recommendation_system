"use client";

import { useEffect, useState } from "react";
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

interface Section {
  name: string;
  categories: string[];
}

const AllSectionsAndCategories: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        const data: Product[] = await response.json();

        const uniqueSections = Array.from(
          new Set(data.map((product) => product.section))
        );

        const sectionsWithCategories: Section[] = uniqueSections.map(
          (section) => ({
            name: section,
            categories: Array.from(
              new Set(
                data
                  .filter((product) => product.section === section)
                  .map((product) => product.category)
              )
            ),
          })
        );

        setSections(sectionsWithCategories);
      } catch (error) {
        console.error("Error fetching sections and categories:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center m-4">
      <div className="w-4/5 flex flex-wrap justify-center content-center">
        {sections.map((section, index) => (
          <Link
            href={`/section/${section.name}`}
            key={index}
            className="w-1/2 border p-12"
          >
            <h2>{section.name}</h2>
            <ul className="mt-4">
              {section.categories.map((category, catIndex) => (
                <Link className="mr-2" href={`/category/${category}`} key={catIndex}>
                  {category}
                </Link>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllSectionsAndCategories;
