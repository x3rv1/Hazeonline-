#  Haze Online - E-commerce Shop

A modern full-stack e-commerce web application built with **React** (Frontend) and **FastAPI** (Backend).

##  Project Overview

Haze Online is a simple yet functional online shop that allows users to:
- Browse product categories
- View and manage products
- Add items to a shopping cart
- Place orders

##  Architecture

```
Hazeonline-/
├── Backend/           # FastAPI Python backend
│   ├── app.py         # Main API endpoints
│   ├── models.py      # SQLAlchemy database models
│   ├── database.py    # Database configuration
│   └── haze.db        # SQLite database
│
└── Frontend/          # React + Vite frontend
    └── src/
        ├── pages/     # Page components
        ├── components/# Reusable UI components
        └── api/       # API client
```

##  Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Lightweight database
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling

##  Getting Started

### Prerequisites
- Python(Backend)
- React (Frontend)
  
  

### Backend Setup

```bash
cd Backend
pipenv install
pipenv run uvicorn app: app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

##  API Endpoints

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories |
| POST | `/categories` | Create a category |
| GET | `/categories/{id}` | Get single category |
| PATCH | `/categories/{id}` | Update category |
| DELETE | `/categories/{id}` | Delete category |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| POST | `/products` | Create a product |
| GET | `/products/{id}` | Get single product |
| PATCH | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |
| GET | `/categories/{id}/products` | Get products by category |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Get all orders |
| POST | `/orders` | Create an order |
| GET | `/orders/{id}` | Get single order |
| PATCH | `/orders/{id}` | Update order status |
| DELETE | `/orders/{id}` | Delete order |

### Order Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/order_items` | Get all order items |
| POST | `/order_items` | Add item to order |
| GET | `/order_items/{id}` | Get single order item |

## User Stories

-  **Browse Categories** - Users can view all product categories
-  **View Products** - Users can see all available products
-  **Product Details** - Users can view individual product information
-  **Shopping Cart** - Users can add products to cart
-  **Place Orders** - Users can checkout and create orders
-  **Order Management** - View and track order status


## License

This project is for my Phase 3.
