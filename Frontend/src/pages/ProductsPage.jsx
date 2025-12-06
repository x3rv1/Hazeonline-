import React from "react";
import ProductList from "../components/ProductList.jsx";
import ProductForm from "../components/ProductForm.jsx";

function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Product Management</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <ProductList />
        <ProductForm />
      </div>
    </div>
  );
}

export default ProductsPage;
