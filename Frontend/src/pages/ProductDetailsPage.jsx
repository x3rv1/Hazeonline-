import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../api/client.js";
import { ShoppingCart, Package, ArrowLeft, Check } from "lucide-react";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Fetch product details when the page loads
  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await apiGet(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Function to add the item to the cart (localStorage)
  function handleAddToCart() {
    if (!product) return;

    // Get existing cart from local storage
    const existingCart = localStorage.getItem("hazeCart");
    let cart = existingCart ? JSON.parse(existingCart) : [];

    // Check if item is already in cart
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex > -1) {
      // If it exists, verify stock before increasing quantity
      if (cart[existingItemIndex].quantity < product.stock) {
        cart[existingItemIndex].quantity += 1;
      } else {
        alert("Cannot add more. Stock limit reached!");
        return;
      }
    } else {
      // Add new item with quantity 1
      cart.push({ ...product, quantity: 1 });
    }

    // Save back to local storage
    localStorage.setItem("hazeCart", JSON.stringify(cart));
    
    // Show success feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">Product not found.</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image Section */}
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center relative">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`${product.image_url ? 'hidden' : 'flex'} w-full h-full items-center justify-center bg-gray-100`}>
            <Package size={64} className="text-gray-400" />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
            <p className="text-2xl font-bold text-blue-600 mt-2">KSh {product.price?.toLocaleString()}</p>
          </div>

          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description || "No description available for this product."}
            </p>
          </div>

          <div className="space-y-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 0 
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {product.stock > 0 ? `${product.stock} items in stock` : "Out of Stock"}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                added 
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } ${product.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {added ? (
                <>
                  <Check size={24} /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={24} /> Add to Cart
                </>
              )}
            </button>
            {product.stock <= 0 && (
              <p className="text-red-500 text-sm text-center">Sorry, this item is currently unavailable.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
