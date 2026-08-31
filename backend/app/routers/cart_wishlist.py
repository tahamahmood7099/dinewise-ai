from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CartItem, WishlistItem, Product, Interaction
from ..schemas import (
    CartItemAdd, CartItemUpdate, CartItemResponse, 
    WishlistItemAdd, WishlistItemResponse
)

router = APIRouter(prefix="", tags=["Cart & Wishlist"])

# CART ENDPOINTS
@router.get("/cart", response_model=List[CartItemResponse])
def get_cart(
    user_id: Optional[int] = None,
    session_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CartItem)
    if user_id:
        query = query.filter(CartItem.user_id == user_id)
    elif session_id:
        query = query.filter(CartItem.session_id == session_id)
    else:
        return []
    return query.all()

@router.post("/cart", response_model=CartItemResponse)
def add_to_cart(
    item_in: CartItemAdd,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == item_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if item already in cart
    query = db.query(CartItem).filter(CartItem.product_id == item_in.product_id)
    if user_id:
        existing = query.filter(CartItem.user_id == user_id).first()
    elif item_in.session_id:
        existing = query.filter(CartItem.session_id == item_in.session_id).first()
    else:
        existing = None

    if existing:
        existing.quantity += item_in.quantity
        db.commit()
        db.refresh(existing)
        target_item = existing
    else:
        new_item = CartItem(
            user_id=user_id,
            session_id=item_in.session_id,
            product_id=item_in.product_id,
            quantity=item_in.quantity
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        target_item = new_item

    # Log interaction for recommendation engine
    interaction = Interaction(
        user_id=user_id,
        session_id=item_in.session_id,
        product_id=item_in.product_id,
        interaction_type="cart",
        weight=7.0
    )
    db.add(interaction)
    db.commit()

    return target_item

@router.put("/cart/{item_id}", response_model=CartItemResponse)
def update_cart_item(
    item_id: int,
    update_in: CartItemUpdate,
    db: Session = Depends(get_db)
):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if update_in.quantity <= 0:
        db.delete(item)
        db.commit()
        raise HTTPException(status_code=200, detail="Item removed")

    item.quantity = update_in.quantity
    db.commit()
    db.refresh(item)
    return item

@router.delete("/cart/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"status": "success", "message": "Item removed from cart"}

# WISHLIST ENDPOINTS
@router.get("/wishlist", response_model=List[WishlistItemResponse])
def get_wishlist(
    user_id: Optional[int] = None,
    session_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(WishlistItem)
    if user_id:
        query = query.filter(WishlistItem.user_id == user_id)
    elif session_id:
        query = query.filter(WishlistItem.session_id == session_id)
    else:
        return []
    return query.all()

@router.post("/wishlist", response_model=WishlistItemResponse)
def add_to_wishlist(
    item_in: WishlistItemAdd,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == item_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    query = db.query(WishlistItem).filter(WishlistItem.product_id == item_in.product_id)
    if user_id:
        existing = query.filter(WishlistItem.user_id == user_id).first()
    elif item_in.session_id:
        existing = query.filter(WishlistItem.session_id == item_in.session_id).first()
    else:
        existing = None

    if existing:
        return existing

    new_item = WishlistItem(
        user_id=user_id,
        session_id=item_in.session_id,
        product_id=item_in.product_id
    )
    db.add(new_item)

    # Log interaction for recommendation engine
    interaction = Interaction(
        user_id=user_id,
        session_id=item_in.session_id,
        product_id=item_in.product_id,
        interaction_type="wishlist",
        weight=5.0
    )
    db.add(interaction)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/wishlist/{item_id}")
def remove_from_wishlist(item_id: int, db: Session = Depends(get_db)):
    item = db.query(WishlistItem).filter(WishlistItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    db.delete(item)
    db.commit()
    return {"status": "success", "message": "Item removed from wishlist"}

@router.post("/wishlist/{item_id}/move-to-cart")
def move_wishlist_to_cart(item_id: int, db: Session = Depends(get_db)):
    wish_item = db.query(WishlistItem).filter(WishlistItem.id == item_id).first()
    if not wish_item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")

    # Add to cart
    cart_item = CartItem(
        user_id=wish_item.user_id,
        session_id=wish_item.session_id,
        product_id=wish_item.product_id,
        quantity=1
    )
    db.add(cart_item)
    db.delete(wish_item)
    db.commit()
    return {"status": "success", "message": "Moved to cart successfully"}
