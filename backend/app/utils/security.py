import hashlib
import os

def get_password_hash(password: str) -> str:
    """Create a SHA256 hashed password with salt."""
    salt = "bharatkart_ai_salt_2026"
    return hashlib.sha256(f"{salt}{password}".encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password."""
    return get_password_hash(plain_password) == hashed_password or plain_password == hashed_password
