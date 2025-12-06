import React, { useState, useEffect } from "react";
import { apiPost, apiGet } from "../api/client.js";
import { Card, CardHeader, CardTitle } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input, Label } from "./ui/input.jsx";
import { ShoppingCart, Trash2, Plus, Minus, CheckCircle } from "lucide-react";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [products, setProducts] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("hazeCart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    
    // Fetch products to add to cart
    async function fetchProducts() {
      const data = await apiGet("/products");
      setProducts(data);
    }
    fetchProducts();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("hazeCart", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, delta) {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return item;
          if (newQty > item.stock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout(e) {
    e.preventDefault();
    if (cartItems.length === 0 || !customerName.trim()) return;

    setLoading(true);
    try {
      // Create order
      const orderRes = await apiPost("/orders", { customer_name: customerName });
      const orderId = orderRes.order_id;

      // Add order items
      for (const item of cartItems) {
        await apiPost("/order_items", {
          order_id: orderId,
          product_id: item.id,
          quantity: item.quantity,
        });
      }

      // Clear cart
      setCartItems([]);
      setCustomerName("");
      setOrderPlaced(true);
      localStorage.removeItem("hazeCart");

      setTimeout(() => setOrderPlaced(false), 5000);
    } catch (error) {
      alert("Failed to place order: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  if (orderPlaced) {
    return (
      <Card className="text-center py-12">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-green-600">Order Placed!</h2>
        <p className="text-gray-600 mt-2">Thank you for your purchase.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <ShoppingCart className="text-blue-600" />
        Shopping Cart
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Product selection */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Products</CardTitle>
            </CardHeader>
            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {products.filter(p => p.stock > 0).map((product) => (
                <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">KSh {product.price?.toLocaleString()} • {product.stock} in stock</p>
                  </div>
                  <Button variant="success" onClick={() => addToCart(product)} className="flex items-center gap-1">
                    <Plus size={16} /> Add
                  </Button>
                </div>
              ))}
              {products.filter(p => p.stock > 0).length === 0 && (
                <p className="text-gray-500 text-center py-4">No products available</p>
              )}
            </div>
          </Card>

          {/* Cart items */}
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({cartItems.length})</CardTitle>
            </CardHeader>
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        KSh {item.price?.toLocaleString()} × {item.quantity} = 
                        <span className="font-semibold"> KSh {(item.price * item.quantity).toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus size={16} />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button variant="secondary" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus size={16} />
                      </Button>
                      <Button variant="danger" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Checkout */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-3xl font-bold text-blue-600">KSh {total.toLocaleString()}</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <Label htmlFor="customerName">Your Name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full"
              >
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Cart;
