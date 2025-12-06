import React, { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../api/client.js";
// import { Card } from "./ui/card.jsx";
// import { Button } from "./ui/button.jsx";
import { Package, Trash2, ShoppingCart, AlertCircle } from "lucide-react";

function ProductList({ categoryId, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    setLoading(true);
    const endpoint = categoryId ? `/categories/${categoryId}/products` : "/products";
    const data = await apiGet(endpoint);
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await apiDelete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert("Failed to delete product");
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

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No products yet. Add your first product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Package className="text-blue-600" />
        Products ({products.length})
      </h2>
      
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 hover:shadow-lg">
            <div className="flex justify-between items-start gap-4">
              {/* Product Image */}
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="text-gray-400" size={32} />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{product.description || "No description"}</p>
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-xl font-bold text-blue-600">
                    KSh {product.price?.toLocaleString()}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {onAddToCart && product.stock > 0 && (
                  <button
                    onClick={() => onAddToCart(product)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded text-sm flex items-center gap-1"
                  >
                    <ShoppingCart size={16} />
                    Add
                  </button>
                )}
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 font-medium p-2 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
