
import sys
import os

# Add current directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Product, Category, Order, OrderItem

# Utils
def get_db_session():
    return SessionLocal()

def print_separator():
    print("-" * 50)

def print_header(title):
    print("\n" + "=" * 50)
    print(f"   {title.upper()}")
    print("=" * 50)

# 1. List Functions (Demonstrating Lists and Tuples)
def list_products(db: Session):
    products = db.query(Product).all()
    if not products:
        print("No products found.")
        return
    
    print("\n{:<5} {:<30} {:<10} {:<10}".format("ID", "Name", "Price", "Stock"))
    print_separator()
    for p in products:
        # Using a tuple for formatting
        row = (p.id, p.name, f"KSh {p.price}", p.stock)
        print("{:<5} {:<30} {:<10} {:<10}".format(*row))

def list_categories(db: Session):
    categories = db.query(Category).all()
    if not categories:
        print("No categories found.")
        return
    print("\n{:<5} {:<30}".format("ID", "Name"))
    print_separator()
    for c in categories:
        print("{:<5} {:<30}".format(c.id, c.name))

# 2. Create Functions (Demonstrating Input handling)
def create_product(db: Session):
    print_header("Add New Product")
    list_categories(db)
    print("\n--- Enter Product Details ---")
    
    try:
        name = input("Name: ")
        price = float(input("Price: "))
        category_id = int(input("Category ID: "))
        stock = int(input("Stock: "))
        description = input("Description (optional): ")
        
        # Validation: Check if category exists
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            print("Error: Category ID not found!")
            return

        new_product = Product(
            name=name,
            price=price,
            category_id=category_id,
            stock=stock,
            description=description
        )
        db.add(new_product)
        db.commit()
        print(f"Success! Product '{name}' added.")
        
    except ValueError:
        print("Error: Invalid input (please enter numbers for price/stock/ID).")

def create_category(db: Session):
    print_header("Add New Category")
    name = input("Category Name: ")
    description = input("Description: ")
    
    new_cat = Category(name=name, description=description)
    db.add(new_cat)
    db.commit()
    print(f"Success! Category '{name}' created.")

# 3. Analytics (Demonstrating simple algorithms/logic)
def show_analytics(db: Session):
    print_header("Store Analytics")
    
    # Total Products
    product_count = db.query(Product).count()
    
    # Low Stock Items
    low_stock = db.query(Product).filter(Product.stock < 5).all()
    
    # Total Value of Inventory (List comprehension)
    all_products = db.query(Product).all()
    total_value = sum([p.price * p.stock for p in all_products])
    
    print(f"Total Products: {product_count}")
    print(f"Inventory Value: KSh {total_value:,.2f}")
    
    if low_stock:
        print("\n[!] Low Stock Warning (Less than 5 items):")
        for p in low_stock:
            print(f"- {p.name} ({p.stock} left)")
    else:
        print("\nAll stock levels are healthy.")

# Main Menu
def main():
    db = get_db_session()
    
    while True:
        print_header("Haze Online CLI Store Manager")
        print("1. List Products")
        print("2. List Categories")
        print("3. Add Product")
        print("4. Add Category")
        print("5. View Store Analytics")
        print("6. Exit")
        
        choice = input("\nEnter choice (1-6): ")
        
        if choice == '1':
            list_products(db)
        elif choice == '2':
            list_categories(db)
        elif choice == '3':
            create_product(db)
        elif choice == '4':
            create_category(db)
        elif choice == '5':
            show_analytics(db)
        elif choice == '6':
            print("Goodbye!")
            break
        else:
            print("Invalid choice, try again.")
        
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()
