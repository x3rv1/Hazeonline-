import React from "react";
import CategoryList from "../components/CategoryList.jsx";
import CategoryForm from "../components/CategoryForm.jsx";

function CategoriesPage() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <CategoryList />
      <CategoryForm />
    </div>
  );
}

export default CategoriesPage;
