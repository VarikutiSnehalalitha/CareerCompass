import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

# Determine active database URL (support PostgreSQL, fallback to SQLite)
db_url = settings.DATABASE_URL
connect_args = {}

if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # Test if PostgreSQL is reachable
    try:
        test_engine = create_engine(db_url, pool_pre_ping=True)
        with test_engine.connect() as conn:
            pass
        logger.info(f"Connected successfully to PostgreSQL at {db_url.split('@')[-1]}")
    except Exception as e:
        logger.warning(f"PostgreSQL connection failed: {e}. Falling back to SQLite for local reliability: {settings.SQLITE_FALLBACK_URL}")
        db_url = settings.SQLITE_FALLBACK_URL
        connect_args = {"check_same_thread": False}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
