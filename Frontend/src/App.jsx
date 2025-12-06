import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import CategoryProductsPage from "./pages/CategoryProductsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryProductsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white text-center py-4 mt-8">
          <p>&copy; 2024 Haze Online</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
