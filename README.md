# Haze Online

A FastAPI backend for the Haze Online e-commerce application.

## Tech Stack

- **FastAPI** - Web framework
- **SQLAlchemy** - Database ORM
- **Alembic** - Database migrations
- **SQLite** (development) / **PostgreSQL** (production)

## Quick Start

```bash
# 1. Install dependencies
pipenv install

# 2. Activate virtual environment
pipenv shell

# 3. Run the server
fastapi dev app.py
```

The API will be available at `http://127.0.0.1:8000`

- **Docs**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

## Project Structure

```
├── app.py          # Main FastAPI application
├── models.py       # SQLAlchemy database models
├── database.py     # Database connection setup
├── migrations/     # Alembic migration files
├── alembic.ini     # Alembic configuration
└── Pipfile         # Python dependencies
```

## Database Migrations

```bash
# Generate a new migration
alembic revision --autogenerate -m "description of changes"

# Apply migrations
alembic upgrade head
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| **Categories** | | |
| POST | `/categories` | Create category |
| GET | `/categories` | List all categories |
| GET | `/categories/{id}` | Get category by ID |
| PATCH | `/categories/{id}` | Update category |
| DELETE | `/categories/{id}` | Delete category |
| **Products** | | |
| POST | `/products` | Create product |
| GET | `/products` | List all products |
| GET | `/products/{id}` | Get product by ID |
| GET | `/categories/{id}/products` | Get products in category |
| PATCH | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |
| **Orders** | | |
| POST | `/orders` | Create order |
| GET | `/orders` | List all orders |
| GET | `/orders/{id}` | Get order by ID |
| PATCH | `/orders/{id}` | Update order status |
| DELETE | `/orders/{id}` | Delete order |
| **Order Items** | | |
| POST | `/order_items` | Add item to order |
| GET | `/order_items` | List all order items |
| GET | `/order_items/{id}` | Get order item by ID |

## Initial Setup (First Time Only)

```bash
# Initialize Alembic migrations (already done)
alembic init migrations

# Update migrations/env.py:
from models import Base
target_metadata = Base.metadata
```