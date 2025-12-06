import React, { useState } from "react";
import { apiPost } from "../api/client.js";
// import { Card, CardHeader, CardTitle } from "./ui/card.jsx";
// import { Button } from "./ui/button.jsx";
// import { Input, Label } from "./ui/input.jsx";
import { Plus } from "lucide-react";

function CategoryForm({ onCategoryCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await apiPost("/categories", formData);
      setMessage({ type: "success", text: "Category created successfully!" });
      setFormData({ name: "", description: "" });
      
      if (onCategoryCreated) onCategoryCreated();
      
      // Reload to update category list
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to create category" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Plus className="text-purple-600" />
          Add New Category
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Category Name *</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Electronics, Clothing"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-colors duration-300"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Description</label>
          <input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Category description (optional)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-colors duration-300"
          />
        </div>

        {message.text && (
          <div className={`p-3 rounded-lg ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
}

export default CategoryForm;
