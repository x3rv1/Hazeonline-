
import sys
import os

# Add current directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Product, Category, Order, OrderItem

# Utils
import sys
import os

# fix imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Product, Category, Order, OrderItem

# Start the database session
def get_db_session():
    return SessionLocal()

# Main function to run the app
def main():
    db = get_db_session()
    
    # Loop forever until user exits
    while True:
        print("\n")
        print("==================================================")
        print("   HAZE ONLINE CLI STORE MANAGER")
        print("==================================================")
        print("1. List Products")
        print("2. List Categories")
        print("3. Add Product")
        print("4. Add Category")
        print("5. View Store Analytics")
        print("6. Exit")
        
        # Get user input
        choice = input("\nEnter choice (1-6): ")
        
        # Check what the user picked
        if choice == '1':
            # Get all products
            products = db.query(Product).all()
            if len(products) == 0:
                print("No products found.")
            else:
                print("\nID    Name                           Price      Stock")
                print("--------------------------------------------------")
                for p in products:
                    # Print each product
                    print(f"{p.id:<5} {p.name:<30} KSh {p.price:<10} {p.stock:<10}")

        elif choice == '2':
            # Get all categories
            categories = db.query(Category).all()
            if len(categories) == 0:
                print("No categories found.")
            else:
                print("\nID    Name")
                print("--------------------------------------------------")
                for c in categories:
                    print(f"{c.id:<5} {c.name}")

        elif choice == '3':
            # Add a new product
            print("\n--- Enter Product Details ---")
            try:
                name = input("Name: ")
                price = float(input("Price: "))
                category_id = int(input("Category ID: "))
                stock = int(input("Stock: "))
                description = input("Description (optional): ")
                
                # Create the product object
                new_product = Product(
                    name=name,
                    price=price,
                    category_id=category_id,
                    stock=stock,
                    description=description
                )
                # Add to database
                db.add(new_product)
                db.commit()
                print("Success! Product added.")
            except:
                print("Something went wrong. Please check your inputs.")

        elif choice == '4':
            # Add a new category
            print("Add New Category")
            name = input("Category Name: ")
            description = input("Description: ")
            
            new_cat = Category(name=name, description=description)
            db.add(new_cat)
            db.commit()
            print("Success! Category created.")

        elif choice == '5':
            # Simple stats
            print("Store Analytics")
            product_count = db.query(Product).count()
            all_products = db.query(Product).all()
            
            # Calculate total value using a loop
            total_value = 0
            for p in all_products:
                total_value = total_value + (p.price * p.stock)
            
            print(f"Total Products: {product_count}")
            print(f"Inventory Value: KSh {total_value}")

        elif choice == '6':
            print("Goodbye!")
            break
        
        else:
            print("Invalid choice, try again.")
        
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()
