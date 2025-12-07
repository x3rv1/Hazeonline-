from datetime import datetime
from sqlalchemy import Column, Integer, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

# Base class for all models
Base = declarative_base()


# CATEGORY MODEL

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False, unique=True)   # Category name (e.g. "Anime Apparel")
    description = Column(Text)                         # Optional description of the category
    created_at = Column(DateTime, default=datetime.now) # Timestamp when category was created

    # Relationship: One category can have many products
    products = relationship("Product", back_populates="category")



# PRODUCT MODEL

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False, unique=True)   # Product name
    description = Column(Text)                         # Product description
    price = Column(Float, nullable=False)              # Product price
    stock = Column(Integer, default=0)                 # Available stock count
    image_url = Column(Text)                          
    created_at = Column(DateTime, default=datetime.now) # Timestamp when product was created

    # Foreign key: Product belongs to a category
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    # Relationships
    category = relationship("Category", back_populates="products") # Link back to category
    order_items = relationship("OrderItem", back_populates="product") # Link to order items



# ORDER MODEL

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    customer_name = Column(Text, nullable=False)       # Name of the customer placing the order
    created_at = Column(DateTime, default=datetime.now) # Timestamp when order was created
    status = Column(Text, default="pending")           # Order status (pending, shipped, etc.)

    # Relationship: One order can have many order items
    order_items = relationship("OrderItem", back_populates="order")



# ORDER ITEM MODEL

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)   # Link to order
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False) # Link to product
    quantity = Column(Integer, default=1)              # How many of this product were bought
    price_at_purchase = Column(Float, nullable=False)  # Product price at time of purchase

    # Relationships back to Order and Product
    order = relationship("Order", back_populates="order_items")   # Link back to order
    product = relationship("Product", back_populates="order_items") # Link back to product
