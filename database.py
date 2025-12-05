"""
Database configuration and session management.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

# Database URL - using SQLite for development
DATABASE_URL = "sqlite:///./haze.db"

# Create database engine
# check_same_thread=False is needed for SQLite to work with FastAPI
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Session factory for creating database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)


def get_db():
    """
    Database session dependency for FastAPI.
    
    Yields a database session and ensures it's closed after the request.
    Use this with FastAPI's Depends() in route functions.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()