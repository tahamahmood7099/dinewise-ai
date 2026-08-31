import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserLogin, Token, UserOut
from ..utils.security import verify_password, get_password_hash, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please sign in."
        )

    new_user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        role="user",
        city=payload.city or "Hyderabad",
        dietary_pref=payload.dietary_pref or "All",
        preferred_budget=payload.preferred_budget or "Moderate",
        preferred_cuisines=json.dumps(payload.preferred_cuisines or ["Biryani"]),
        preferred_areas=json.dumps(payload.preferred_areas or ["Banjara Hills"])
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "email": new_user.email})
    return Token(
        access_token=token,
        user=UserOut(
            id=new_user.id,
            name=new_user.name,
            email=new_user.email,
            role=new_user.role,
            city=new_user.city,
            dietary_pref=new_user.dietary_pref,
            preferred_budget=new_user.preferred_budget,
            preferred_cuisines=json.loads(new_user.preferred_cuisines or "[]"),
            preferred_areas=json.loads(new_user.preferred_areas or "[]"),
            created_at=new_user.created_at
        )
    )

@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(
        access_token=token,
        user=UserOut(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            city=user.city,
            dietary_pref=user.dietary_pref,
            preferred_budget=user.preferred_budget,
            preferred_cuisines=json.loads(user.preferred_cuisines or "[]"),
            preferred_areas=json.loads(user.preferred_areas or "[]"),
            created_at=user.created_at
        )
    )
