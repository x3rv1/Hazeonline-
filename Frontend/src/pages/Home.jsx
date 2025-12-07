import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Removed imports for separate components to keep it simple
// import { Card } from "../components/ui/card.jsx";
// import { Button } from "../components/ui/button.jsx";
import { apiGet } from "../api/client.js";
import { ShoppingBag, Grid, Package, ArrowRight, Sparkles } from "lucide-react";

function Home() {
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [products, cats] = await Promise.all([
        apiGet("/products"),
        apiGet("/categories"),
      ]);
      setNewProducts(products.slice(-6));
      setCategories(cats);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Haze Online</h1>
        <p className="text-xl opacity-90 mb-8">
          Your one-stop destination for amazing products
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/categories">
            <button className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white/20 flex items-center gap-2">
              <Grid size={18} /> Browse Categories
            </button>
          </Link>
          <Link to="/products">
            <button className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white/20 flex items-center gap-2">
              <Package size={18} /> View Products
            </button>
          </Link>
          <Link to="/cart">
            <button className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white/20 flex items-center gap-2">
              <ShoppingBag size={18} /> Go to Cart
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 text-center">
          <p className="text-3xl font-bold text-blue-600">{newProducts.length}</p>
          <p className="text-gray-600">Products</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 text-center">
          <p className="text-3xl font-bold text-purple-600">{categories.length}</p>
          <p className="text-gray-600">Categories</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 text-center">
          <p className="text-3xl font-bold text-green-600">24/7</p>
          <p className="text-gray-600">Available</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 text-center">
          <p className="text-3xl font-bold text-orange-600">Fast</p>
          <p className="text-gray-600">Delivery</p>
        </div>
      </div>

      {/* Categories Preview */}
      {categories.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Grid className="text-purple-600" /> Categories
            </h2>
            <Link to="/categories" className="text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((cat) => (
              <Link key={cat.id} to={`/categories/${cat.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 text-center hover:shadow-lg cursor-pointer h-full">
                  <h3 className="font-semibold text-lg">{cat.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{cat.description || "Browse products"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* New Arrivals */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-yellow-500" /> New Arrivals
          </h2>
          <Link to="/products" className="text-blue-600 hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : newProducts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 text-center py-8">
            <p className="text-gray-500">No products yet. Add some products to get started!</p>
            <Link to="/products">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-4">Add Products</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="block">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 hover:shadow-lg h-full">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {/* Fallback for error state */}
                    {product.image_url && <div className="hidden w-full h-full items-center justify-center bg-gray-100 absolute top-0 left-0"><Package className="h-12 w-12 text-gray-400" /></div>}
                  </div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {product.description || "No description"}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-blue-600">
                      KSh {product.price?.toLocaleString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
