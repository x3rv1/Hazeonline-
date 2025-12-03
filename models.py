from datetime import datetime
from sqlalchemy import Column, Integer, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False, unique=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.now)

    # Relationship to Product
    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False, unique=True)
    description = Column(Text)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.now)

    # Foreign key to Category
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    # Relationship back to Category
    category = relationship("Category", back_populates="products")

    # Relationship to OrderItems
    order_items = relationship("OrderItem", back_populates="product")


class Order(Base): #Order: Represents a customer’s purchase, with fields for customer_name, created_at, and status.
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    customer_name = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    status = Column(Text, default="pending")

    # Relationship to OrderItems
    order_items = relationship("OrderItem", back_populates="order")


class OrderItem(Base): #OrderItem: Association table linking Order and Product. It stores quantity and price_at_purchase so you can track what was bought and at what price.
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    price_at_purchase = Column(Float, nullable=False)

    # Relationships back to Order and Product
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items") 