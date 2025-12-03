from fastapi import FastAPI, Form
from models import Product, Category, Order, OrderItem
from database import SessionLocal

# Start the FastAPI app
app = FastAPI()

# Simple helper to get a database session
def get_db():
    db = SessionLocal()
    return db

# -------------------------------
# Test route
# -------------------------------
@app.get("/")
def home():
    return {"message": "Hello World"}

# -------------------------------
# CATEGORY ROUTES
# -------------------------------
@app.post("/categories")
def create_category(
    name: str = Form(...),
    description: str = Form(None)
):
    db = get_db()
    new_category = Category(name=name, description=description)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return {"message": "Category created", "category_id": new_category.id}

@app.get("/categories")
def get_categories():
    db = get_db()
    return db.query(Category).all()

@app.get("/categories/{category_id}")
def get_category(category_id: int):
    db = get_db()
    category = db.query(Category).filter(Category.id == category_id).first()
    if category is None:
        return {"error": "Category not found"}
    return category

@app.patch("/categories/{category_id}")
def update_category(
    category_id: int,
    name: str = Form(None),
    description: str = Form(None)
):
    db = get_db()
    category = db.query(Category).filter(Category.id == category_id).first()
    if category is None:
        return {"error": "Category not found"}
    if name is not None:
        category.name = name
    if description is not None:
        category.description = description
    db.commit()
    db.refresh(category)
    return {"message": "Category updated", "category_id": category.id}

@app.delete("/categories/{category_id}")
def delete_category(category_id: int):
    db = get_db()
    category = db.query(Category).filter(Category.id == category_id).first()
    if category is None:
        return {"error": "Category not found"}
    db.delete(category)
    db.commit()
    return {"message": "Category deleted"}

# -------------------------------
# PRODUCT ROUTES
# -------------------------------
@app.post("/products")
def create_product(
    name: str = Form(...),
    price: float = Form(...),
    category_id: int = Form(...),
    description: str = Form(None),
    stock: int = Form(0),
    image_url: str = Form(None)  # optional: store a link to product image
):
    db = get_db()
    category = db.query(Category).filter(Category.id == category_id).first()
    if category is None:
        return {"error": "Category not found"}
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
def get_products():
    db = get_db()
    return db.query(Product).all()

@app.get("/products/{product_id}")
def get_product(product_id: int):
    db = get_db()
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        return {"error": "Product not found"}
    if product.stock == 0:
        return {"error": "Product out of stock"}
    return product

@app.get("/categories/{category_id}/products")
def get_products_by_category(category_id: int):
    db = get_db()
    return db.query(Product).filter(Product.category_id == category_id).all()

@app.patch("/products/{product_id}")
def update_product(
    product_id: int,
    name: str = Form(None),
    price: float = Form(None),
    stock: int = Form(None),
    description: str = Form(None),
    image_url: str = Form(None)
):
    db = get_db()
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        return {"error": "Product not found"}
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
def delete_product(product_id: int):
    db = get_db()
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        return {"error": "Product not found"}
    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}

# -------------------------------
# ORDER ROUTES
# -------------------------------
@app.post("/orders")
def create_order(
    customer_name: str = Form(...)
):
    db = get_db()
    new_order = Order(customer_name=customer_name)
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return {"message": "Order created", "order_id": new_order.id}

@app.get("/orders")
def get_orders():
    db = get_db()
    return db.query(Order).all()

@app.get("/orders/{order_id}")
def get_order(order_id: int):
    db = get_db()
    order = db.query(Order).filter(Order.id == order_id).first()
    if order is None:
        return {"error": "Order not found"}
    return order

@app.patch("/orders/{order_id}")
def update_order(
    order_id: int,
    status: str = Form(None)
):
    db = get_db()
    order = db.query(Order).filter(Order.id == order_id).first()
    if order is None:
        return {"error": "Order not found"}
    if status is not None:
        order.status = status
    db.commit()
    db.refresh(order)
    return {"message": "Order updated", "order_id": order.id}

@app.delete("/orders/{order_id}")
def delete_order(order_id: int):
    db = get_db()
    order = db.query(Order).filter(Order.id == order_id).first()
    if order is None:
        return {"error": "Order not found"}
    db.delete(order)
    db.commit()
    return {"message": "Order deleted"}

# -------------------------------
# ORDER ITEM ROUTES
# -------------------------------
@app.post("/order_items")
def create_order_item(
    order_id: int = Form(...),
    product_id: int = Form(...),
    quantity: int = Form(...)
):
    db = get_db()
    order = db.query(Order).filter(Order.id == order_id).first()
    product = db.query(Product).filter(Product.id == product_id).first()

    if order is None:
        return {"error": "Order not found"}
    if product is None:
        return {"error": "Product not found"}
    if quantity <= 0:
        return {"error": "Quantity must be greater than zero"}
    if product.stock < quantity:
        return {"error": "Not enough stock"}

    # reduce stock
    product.stock -= quantity

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
def get_order_items():
    db = get_db()
    return db.query(OrderItem).all()

@app.get("/order_items/{item_id}")
def get_order_item(item_id: int):
    db = get_db()
    item = db.query(OrderItem).filter(OrderItem.id == item_id).first()
    if item is None:
        return {"error": "Order item not found"}
    return item