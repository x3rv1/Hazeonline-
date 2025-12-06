import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-colors duration-300 ${className}`}
      {...props}
    />
  );
}

export function Label({ children, className = "", ...props }) {
  return (
    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300 ${className}`} {...props}>
      {children}
    </label>
  );
}

export function Select({ children, className = "", ...props }) {
  return (
    <select
      className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
