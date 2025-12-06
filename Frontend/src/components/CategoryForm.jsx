import React, { useState } from "react";
import { apiPost } from "../api/client.js";
import { Card, CardHeader, CardTitle } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input, Label } from "./ui/input.jsx";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="text-purple-600" />
          Add New Category
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Electronics, Clothing"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Category description (optional)"
          />
        </div>

        {message.text && (
          <div className={`p-3 rounded-lg ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Category"}
        </Button>
      </form>
    </Card>
  );
}

export default CategoryForm;
