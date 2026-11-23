import time
from typing import Any, Optional, Dict

class MemoryCache:
    """In-memory cache with optional Redis backend fallback"""
    def __init__(self):
        self._store: Dict[str, Any] = {}
        self._expiry: Dict[str, float] = {}

    def get(self, key: str) -> Optional[Any]:
        if key in self._expiry and time.time() > self._expiry[key]:
            self.delete(key)
            return None
        return self._store.get(key)

    def set(self, key: str, value: Any, expire_seconds: Optional[int] = None) -> None:
        self._store[key] = value
        if expire_seconds:
            self._expiry[key] = time.time() + expire_seconds
        elif key in self._expiry:
            del self._expiry[key]

    def delete(self, key: str) -> None:
        self._store.pop(key, None)
        self._expiry.pop(key, None)

    def clear(self) -> None:
        self._store.clear()
        self._expiry.clear()

cache = MemoryCache()
