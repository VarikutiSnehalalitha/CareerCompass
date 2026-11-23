import sys
import os

# Ensure backend root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal, Base, engine
from app.seeds.seed_data import seed_database

def main():
    print("🚀 Initializing CareerCompass database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        print("🎉 CareerCompass database seeding completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    main()
