import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserRegister, UserLogin, UserResponse, TokenResponse
from ..config import settings
from ..utils.security import get_password_hash, verify_password

router = APIRouter(prefix="/auth", tags=["Authentication"])

def create_mock_token(user_id: int, email: str) -> str:
    # Deterministic base token for seamless local demonstration
    return f"bharatkart_token_{user_id}_{email.split('@')[0]}"

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )

    preferences_dict = {"categories": user_data.preferred_categories or []}
    new_user = User(
        name=user_data.name,
        email=user_data.email.lower(),
        password_hash=get_password_hash(user_data.password),
        role="user",
        city=user_data.city or "Mumbai",
        preferences=json.dumps(preferences_dict)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_mock_token(new_user.id, new_user.email)
    return TokenResponse(access_token=token, token_type="bearer", user=new_user)

@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email.lower()).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_mock_token(user.id, user.email)
    return TokenResponse(access_token=token, token_type="bearer", user=user)

@router.get("/user/{user_id}", response_model=UserResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
