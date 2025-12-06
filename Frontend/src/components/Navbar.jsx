import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Home, Grid, Package, Moon, Sun } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/categories", label: "Categories", icon: Grid },
    { path: "/products", label: "Products", icon: Package },
    { path: "/cart", label: "Cart", icon: ShoppingCart },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-900 dark:to-gray-800 text-white shadow-lg transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <img src="/logo.png" alt="Haze Online Logo" className="h-10 w-10 object-contain" />
            Haze Online
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === path
                      ? "bg-white/20 font-semibold"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              ))}
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
