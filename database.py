from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base   # <-- import Base from models.py

SQLALCHEMY_DATABASE_URL = "sqlite:///./haze.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Use Base from models.py
Base.metadata.create_all(bind=engine)