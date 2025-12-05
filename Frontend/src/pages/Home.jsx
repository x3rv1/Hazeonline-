import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { apiGet } from "../api/client.js";

function Home() {
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const products = await apiGet("/products");
      setNewProducts(products.slice(-3));
    }
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-center">Welcome to Haze Shop</h1>
      <p className="text-center text-gray-600">
        Explore our amazing products and categories. Start shopping now!
      </p>

      <div className="flex justify-center gap-4">
        <Link to="/categories">
          <Button variant="default">Browse Categories</Button>
        </Link>
        <Link to="/products">
          <Button variant="secondary">View Products</Button>
        </Link>
        <Link to="/cart">
          <Button variant="outline">Go to Cart</Button>
        </Link>
      </div>

      <h2 className="text-2xl font-semibold text-center mt-8">New Arrivals</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {newProducts.map((product) => (
          <Card key={product.id}>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-700">KSh {product.price}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Home;
