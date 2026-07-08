import redis
import json
from typing import Optional

r = redis.Redis(host="redis", port=6379, db=0, decode_responses=True)

def get_cache(key: str) -> Optional[str]:
    return r.get(key)

def set_cache(key: str, value: str, ttl: int = 300):
    r.setex(key, ttl, value)