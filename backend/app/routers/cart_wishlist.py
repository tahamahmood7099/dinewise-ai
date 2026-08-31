from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CartItem, WishlistItem, Dish, Restaurant, Interaction
from ..schemas import (
    CartItemAdd, CartItemUpdate, CartItemResponse,
    WishlistItemAdd, WishlistItemResponse, DishResponse
)
from ..ml.collaborative_engine import collaborative_engine

router = APIRouter(prefix="", tags=["Food Cart & Favorites"])

# ================= CART =================
@router.get("/cart", response_model=List[CartItemResponse])
def get_cart(
    user_id: Optional[int] = None,
    session_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CartItem)
    if user_id:
        items = query.filter(CartItem.user_id == user_id).all()
    elif session_id:
        items = query.filter(CartItem.session_id == session_id).all()
    else:
        items = []

    results = []
    for item in items:
        dish_res = DishResponse.from_orm(item.dish)
        if item.dish.restaurant:
            dish_res.restaurant_name = item.dish.restaurant.name
            dish_res.restaurant_area = item.dish.restaurant.area
        results.append(CartItemResponse(
            id=item.id,
            dish_id=item.dish_id,
            restaurant_id=item.restaurant_id,
            quantity=item.quantity,
            dish=dish_res
        ))
    return results

@router.post("/cart", response_model=CartItemResponse)
def add_to_cart(
    data: CartItemAdd,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    dish = db.query(Dish).filter(Dish.id == data.dish_id).first()
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")

    target_uid = user_id
    target_sid = data.session_id

    # Check if item already in cart
    existing_q = db.query(CartItem).filter(CartItem.dish_id == data.dish_id)
    if target_uid:
        existing = existing_q.filter(CartItem.user_id == target_uid).first()
    else:
        existing = existing_q.filter(CartItem.session_id == target_sid).first()

    if existing:
        existing.quantity += data.quantity
        db.commit()
        db.refresh(existing)
        cart_item = existing
    else:
        cart_item = CartItem(
            user_id=target_uid,
            session_id=target_sid,
            dish_id=data.dish_id,
            restaurant_id=data.restaurant_id or dish.restaurant_id,
            quantity=data.quantity
        )
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)

    # Log interaction
    inter = Interaction(
        user_id=target_uid,
        session_id=target_sid,
        dish_id=data.dish_id,
        restaurant_id=dish.restaurant_id,
        interaction_type="cart",
        weight=7.0
    )
    db.add(inter)
    db.commit()

    dish_res = DishResponse.from_orm(dish)
    if dish.restaurant:
        dish_res.restaurant_name = dish.restaurant.name
        dish_res.restaurant_area = dish.restaurant.area

    return CartItemResponse(
        id=cart_item.id,
        dish_id=cart_item.dish_id,
        restaurant_id=cart_item.restaurant_id,
        quantity=cart_item.quantity,
        dish=dish_res
    )

@router.put("/cart/{item_id}", response_model=CartItemResponse)
def update_cart_item(item_id: int, data: CartItemUpdate, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if data.quantity <= 0:
        db.delete(item)
        db.commit()
        return CartItemResponse(
            id=item_id,
            dish_id=item.dish_id,
            restaurant_id=item.restaurant_id,
            quantity=0,
            dish=DishResponse.from_orm(item.dish)
        )

    item.quantity = data.quantity
    db.commit()
    db.refresh(item)

    dish_res = DishResponse.from_orm(item.dish)
    if item.dish.restaurant:
        dish_res.restaurant_name = item.dish.restaurant.name
        dish_res.restaurant_area = item.dish.restaurant.area

    return CartItemResponse(
        id=item.id,
        dish_id=item.dish_id,
        restaurant_id=item.restaurant_id,
        quantity=item.quantity,
        dish=dish_res
    )

@router.delete("/cart/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"status": "success", "message": "Removed dish from cart"}

@router.get("/cart/complementary", response_model=List[DishResponse])
def get_cart_complementary_pairings(
    user_id: Optional[int] = None,
    session_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Smart Cart complementary pairings (e.g. Biryani -> Gulab Jamun / Qubani Ka Meetha / Chai)."""
    cart_items = get_cart(user_id=user_id, session_id=session_id, db=db)
    if not cart_items:
        # Default popular desserts/sides
        desserts = db.query(Dish).filter(Dish.category.in_(["Desserts & Sweets", "Irani Chai & Beverages"])).limit(4).all()
        return [DishResponse.from_orm(d) for d in desserts]

    cart_dish_ids = {item.dish_id for item in cart_items}
    pairings = []
    seen = set(cart_dish_ids)

    for item in cart_items:
        fbt = collaborative_engine.get_frequently_ordered_together(item.dish_id, top_n=2)
        for did, score in fbt:
            if did not in seen:
                dish = db.query(Dish).filter(Dish.id == did).first()
                if dish:
                    d_res = DishResponse.from_orm(dish)
                    if dish.restaurant:
                        d_res.restaurant_name = dish.restaurant.name
                        d_res.restaurant_area = dish.restaurant.area
                    d_res.match_score = 94
                    d_res.recommendation_reason = f"Frequently paired with {item.dish.name}"
                    pairings.append(d_res)
                    seen.add(did)

    if len(pairings) < 3:
        desserts = db.query(Dish).filter(Dish.category == "Desserts & Sweets").limit(3).all()
        for d in desserts:
            if d.id not in seen:
                d_res = DishResponse.from_orm(d)
                if d.restaurant:
                    d_res.restaurant_name = d.restaurant.name
                    d_res.restaurant_area = d.restaurant.area
                d_res.match_score = 90
                d_res.recommendation_reason = "Complete your feast with authentic Hyderabadi dessert"
                pairings.append(d_res)
                seen.add(d.id)

    return pairings[:4]

# ================= FAVORITES (WISHLIST) =================
@router.get("/wishlist", response_model=List[WishlistItemResponse])
def get_favorites(
    user_id: Optional[int] = None,
    session_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(WishlistItem)
    if user_id:
        items = query.filter(WishlistItem.user_id == user_id).all()
    elif session_id:
        items = query.filter(WishlistItem.session_id == session_id).all()
    else:
        items = []

    results = []
    for item in items:
        dish_res = DishResponse.from_orm(item.dish)
        if item.dish.restaurant:
            dish_res.restaurant_name = item.dish.restaurant.name
            dish_res.restaurant_area = item.dish.restaurant.area
        results.append(WishlistItemResponse(
            id=item.id,
            dish_id=item.dish_id,
            dish=dish_res
        ))
    return results

@router.post("/wishlist", response_model=WishlistItemResponse)
def add_favorite(
    data: WishlistItemAdd,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    dish = db.query(Dish).filter(Dish.id == data.dish_id).first()
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")

    target_uid = user_id
    target_sid = data.session_id

    existing_q = db.query(WishlistItem).filter(WishlistItem.dish_id == data.dish_id)
    if target_uid:
        existing = existing_q.filter(WishlistItem.user_id == target_uid).first()
    else:
        existing = existing_q.filter(WishlistItem.session_id == target_sid).first()

    if not existing:
        fav = WishlistItem(
            user_id=target_uid,
            session_id=target_sid,
            dish_id=data.dish_id
        )
        db.add(fav)
        db.commit()
        db.refresh(fav)

        inter = Interaction(
            user_id=target_uid,
            session_id=target_sid,
            dish_id=data.dish_id,
            restaurant_id=dish.restaurant_id,
            interaction_type="favorite",
            weight=5.0
        )
        db.add(inter)
        db.commit()
    else:
        fav = existing

    dish_res = DishResponse.from_orm(dish)
    if dish.restaurant:
        dish_res.restaurant_name = dish.restaurant.name
        dish_res.restaurant_area = dish.restaurant.area

    return WishlistItemResponse(id=fav.id, dish_id=fav.dish_id, dish=dish_res)

@router.delete("/wishlist/{item_id}")
def remove_favorite(item_id: int, db: Session = Depends(get_db)):
    fav = db.query(WishlistItem).filter(WishlistItem.id == item_id).first()
    if fav:
        db.delete(fav)
        db.commit()
    return {"status": "success", "message": "Removed from favorites"}
