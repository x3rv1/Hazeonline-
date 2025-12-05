import React from "react";
import ProductList from "../components/ProductList.jsx";
import ProductForm from "../components/ProductForm.jsx";

function ProductsPage() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <ProductList />
      <ProductForm />
    </div>
  );
}

export default ProductsPage;
