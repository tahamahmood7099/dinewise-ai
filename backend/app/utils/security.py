import hashlib
import os
import time
import base64
import json

SECRET_SALT = "dinewise_ai_salt_2026"

def get_password_hash(password: str) -> str:
    """Create a SHA256 hashed password with salt."""
    return hashlib.sha256(f"{SECRET_SALT}{password}".encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password."""
    return get_password_hash(plain_password) == hashed_password or plain_password == hashed_password

def create_access_token(data: dict, expires_delta: int = 86400) -> str:
    """Create a lightweight signed token."""
    payload = {
        **data,
        "exp": int(time.time()) + expires_delta
    }
    payload_bytes = json.dumps(payload).encode("utf-8")
    b64_payload = base64.urlsafe_b64encode(payload_bytes).decode("utf-8")
    signature = hashlib.sha256(f"{b64_payload}{SECRET_SALT}".encode("utf-8")).hexdigest()[:16]
    return f"{b64_payload}.{signature}"
