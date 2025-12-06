import React from "react";
import CategoryList from "../components/CategoryList.jsx";
import CategoryForm from "../components/CategoryForm.jsx";

function CategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Product Categories</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <CategoryList />
        <CategoryForm />
      </div>
    </div>
  );
}

export default CategoriesPage;
