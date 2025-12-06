import React, { useState, useEffect } from "react";
import { apiPost, apiGet } from "../api/client.js";
import { Card, CardHeader, CardTitle } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input, Label, Select } from "./ui/input.jsx";
import { Plus } from "lucide-react";

function ProductForm({ onProductCreated }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category_id: "",
    description: "",
    stock: "0",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function fetchCategories() {
      const data = await apiGet("/categories");
      setCategories(data);
    }
    fetchCategories();
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await apiPost("/products", {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: parseInt(formData.category_id),
      });
      
      setMessage({ type: "success", text: "Product created successfully!" });
      setFormData({
        name: "",
        price: "",
        category_id: "",
        description: "",
        stock: "0",
        image_url: "",
      });
      
      if (onProductCreated) onProductCreated();
      
      // Reload to update product list
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to create product" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="text-blue-600" />
          Add New Product
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (KSh) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="category_id">Category *</Label>
          <Select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
          {categories.length === 0 && (
            <p className="text-sm text-amber-600 mt-1">
              No categories yet. Create a category first!
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description (optional)"
          />
        </div>

        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            name="image_url"
            type="url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {message.text && (
          <div className={`p-3 rounded-lg ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        <Button type="submit" disabled={loading || categories.length === 0} className="w-full">
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </Card>
  );
}

export default ProductForm;
