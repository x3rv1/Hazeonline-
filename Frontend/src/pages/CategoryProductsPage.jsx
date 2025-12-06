import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList.jsx";
import { apiGet } from "../api/client.js";

function CategoryProductsPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const data = await apiGet(`/categories/${id}`);
        setCategory(data);
      } catch (error) {
        console.error("Failed to fetch category", error);
      }
    }
    fetchCategory();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{category ? category.name : "Category"}</h1>
        {category && <p className="text-gray-600 mt-2">{category.description}</p>}
      </div>
      
      <ProductList categoryId={id} />
    </div>
  );
}

export default CategoryProductsPage;
