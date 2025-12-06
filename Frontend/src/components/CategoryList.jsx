import React, { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../api/client.js";
// import { Card } from "./ui/card.jsx";
// import { Button } from "./ui/button.jsx";
import { Grid, Trash2, AlertCircle } from "lucide-react";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCategories() {
    setLoading(true);
    const data = await apiGet("/categories");
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await apiDelete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        alert("Failed to delete category. Make sure no products are linked to it.");
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No categories yet. Add your first category!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Grid className="text-purple-600" />
        Categories ({categories.length})
      </h2>
      
      <div className="grid gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 hover:shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {category.description || "No description"}
                </p>
              </div>
              
              <button
                onClick={() => handleDelete(category.id)}
                className="bg-red-100 hover:bg-red-200 text-red-600 font-medium p-2 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
