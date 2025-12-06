"""
Haze Online - FastAPI Backend

A simple e-commerce API with categories, products, and orders.
"""
# Import necessary libraries
from fastapi import FastAPI, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Import our database models and connection
from models import Product, Category, Order, OrderItem
from database import get_db

# Create the FastAPI app
app = FastAPI(
    title="Haze Online API",
    description="Backend API for Haze Online e-commerce store",
    version="1.0.0"
)

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins (for development/demo)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# HOME ROUTE
# ============================================

@app.get("/")
def home():
    """Health check endpoint."""
    return {"message": "Welcome to Haze Online API"}


# ============================================
# CATEGORY ROUTES
# ============================================

@app.post("/categories")
def create_category(
    name: str = Form(...),
    description: str = Form(None),
    db: Session = Depends(get_db)
):
    """Create a new category."""
    new_category = Category(name=name, description=description)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return {"message": "Category created", "category_id": new_category.id}


@app.get("/categories")
def get_all_categories(db: Session = Depends(get_db)):
    """Get all categories."""
    return db.query(Category).all()


@app.get("/categories/{category_id}")
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Get a single category by ID."""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@app.patch("/categories/{category_id}")
def update_category(
    category_id: int,
    name: str = Form(None),
    description: str = Form(None),
    db: Session = Depends(get_db)
):
    """Update an existing category."""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Only update fields that were provided
    if name is not None:
        category.name = name
    if description is not None:
        category.description = description
    
    db.commit()
    db.refresh(category)
    return {"message": "Category updated", "category_id": category.id}


@app.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    """Delete a category."""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(category)
    db.commit()
    return {"message": "Category deleted"}


# ============================================
# PRODUCT ROUTES
# ============================================

@app.post("/products")
def create_product(
    name: str = Form(...),          # Product name from form data
    price: float = Form(...),       # Product price (must be a number)
    category_id: int = Form(...),   # Which category this product belongs to
    description: str = Form(None),  # Optional description
    stock: int = Form(0),           # Stock quantity (default is 0)
    image_url: str = Form(None),    # URL for the product image
    db: Session = Depends(get_db)   # Database session dependency
):
    """Create a new product."""
    # Check if category exists
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    new_product = Product(
        name=name,
        price=price,
        category_id=category_id,
        description=description,
        stock=stock,
        image_url=image_url
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return {"message": "Product created", "product_id": new_product.id}


@app.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    """Get all products."""
    return db.query(Product).all()


@app.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a single product by ID."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.get("/categories/{category_id}/products")
def get_products_by_category(category_id: int, db: Session = Depends(get_db)):
    """Get all products in a specific category."""
    return db.query(Product).filter(Product.category_id == category_id).all()


@app.patch("/products/{product_id}")
def update_product(
    product_id: int,
    name: str = Form(None),
    price: float = Form(None),
    stock: int = Form(None),
    description: str = Form(None),
    image_url: str = Form(None),
    db: Session = Depends(get_db)
):
    """Update an existing product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Only update fields that were provided
    if name is not None:
        product.name = name
    if price is not None:
        product.price = price
    if stock is not None:
        product.stock = stock
    if description is not None:
        product.description = description
    if image_url is not None:
        product.image_url = image_url
    
    db.commit()
    db.refresh(product)
    return {"message": "Product updated", "product_id": product.id}


@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}


# ============================================
# ORDER ROUTES
# ============================================

@app.post("/orders")
def create_order(
    customer_name: str = Form(...),
    db: Session = Depends(get_db)
):
    """Create a new order."""
    new_order = Order(customer_name=customer_name)
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return {"message": "Order created", "order_id": new_order.id}


@app.get("/orders")
def get_all_orders(db: Session = Depends(get_db)):
    """Get all orders."""
    return db.query(Order).all()


@app.get("/orders/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get a single order by ID."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.patch("/orders/{order_id}")
def update_order(
    order_id: int,
    status: str = Form(None),
    db: Session = Depends(get_db)
):
    """Update order status."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if status is not None:
        order.status = status
    
    db.commit()
    db.refresh(order)
    return {"message": "Order updated", "order_id": order.id}


@app.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """Delete an order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    return {"message": "Order deleted"}


# ============================================
# ORDER ITEM ROUTES
# ============================================

@app.post("/order_items")
def create_order_item(
    order_id: int = Form(...),
    product_id: int = Form(...),
    quantity: int = Form(...),
    db: Session = Depends(get_db)
):
    """Add an item to an order."""
    # Check if order exists
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check if product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Validate quantity
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero")
    
    # Check stock availability
    if product.stock < quantity:
        raise HTTPException(status_code=400, detail="Not enough stock available")
    
    # Reduce product stock
    product.stock -= quantity
    
    # Create the order item
    new_item = OrderItem(
        order_id=order_id,
        product_id=product_id,
        quantity=quantity,
        price_at_purchase=product.price
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return {"message": "Order item added", "order_item_id": new_item.id}


@app.get("/order_items")
def get_all_order_items(db: Session = Depends(get_db)):
    """Get all order items."""
    return db.query(OrderItem).all()


@app.get("/order_items/{item_id}")
def get_order_item(item_id: int, db: Session = Depends(get_db)):
    """Get a single order item by ID."""
    item = db.query(OrderItem).filter(OrderItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Order item not found")
    return item