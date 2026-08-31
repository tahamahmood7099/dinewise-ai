import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..database import get_db
from ..models import Order, OrderItem, Dish, Restaurant, CartItem, Interaction, User
from ..schemas import OrderCreate, OrderResponse, OrderItemResponse

router = APIRouter(prefix="/orders", tags=["Food Orders & Checkout"])

@router.get("", response_model=List[OrderResponse])
def get_orders(
    user_id: Optional[int] = None,
    session_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Order)
    if user_id:
        orders = query.filter(Order.user_id == user_id).order_by(desc(Order.created_at)).all()
    elif session_id:
        orders = query.filter(Order.session_id == session_id).order_by(desc(Order.created_at)).all()
    else:
        orders = query.order_by(desc(Order.created_at)).limit(20).all()

    results = []
    for o in orders:
        items_res = []
        for it in o.items:
            items_res.append(OrderItemResponse(
                id=it.id,
                dish_id=it.dish_id,
                dish_name=it.dish_name,
                price=it.price,
                quantity=it.quantity,
                image=it.image,
                is_veg=it.is_veg
            ))
        results.append(OrderResponse(
            id=o.id,
            order_number=o.order_number,
            user_id=o.user_id,
            total_amount=o.total_amount,
            delivery_fee=o.delivery_fee,
            discount_amount=o.discount_amount,
            payment_method=o.payment_method,
            payment_status=o.payment_status,
            order_status=o.order_status,
            shipping_name=o.shipping_name,
            shipping_phone=o.shipping_phone,
            shipping_address=o.shipping_address,
            shipping_city=o.shipping_city,
            shipping_area=o.shipping_area,
            shipping_pincode=o.shipping_pincode,
            created_at=o.created_at,
            items=items_res
        ))
    return results

@router.post("", response_model=OrderResponse)
def create_order(
    data: OrderCreate,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    if not data.items:
        raise HTTPException(status_code=400, detail="Cannot create empty order")

    target_uid = user_id
    target_sid = data.session_id

    total_amount = 0.0
    order_items_to_create = []
    detected_rest_id = data.restaurant_id

    for it in data.items:
        dish = db.query(Dish).filter(Dish.id == it.dish_id).first()
        if not dish:
            raise HTTPException(status_code=404, detail=f"Dish ID {it.dish_id} not found")

        item_total = dish.price * it.quantity
        total_amount += item_total
        if not detected_rest_id:
            detected_rest_id = dish.restaurant_id

        order_items_to_create.append({
            "dish_id": dish.id,
            "dish_name": dish.name,
            "price": dish.price,
            "quantity": it.quantity,
            "image": dish.image,
            "is_veg": dish.is_veg
        })

        # Log purchase interaction with max weight (10.0)
        inter = Interaction(
            user_id=target_uid,
            session_id=target_sid,
            dish_id=dish.id,
            restaurant_id=dish.restaurant_id,
            interaction_type="order",
            weight=10.0
        )
        db.add(inter)

    delivery_fee = 30.0
    discount = 50.0 if total_amount >= 400 else 0.0
    grand_total = total_amount + delivery_fee - discount

    order_num = f"BB-HYD-{random.randint(100000, 999999)}"

    order = Order(
        order_number=order_num,
        user_id=target_uid,
        session_id=target_sid,
        restaurant_id=detected_rest_id,
        total_amount=grand_total,
        delivery_fee=delivery_fee,
        discount_amount=discount,
        payment_method=data.payment_method,
        payment_status="Completed",
        order_status="Preparing in Kitchen",
        shipping_name=data.shipping_name,
        shipping_phone=data.shipping_phone,
        shipping_address=data.shipping_address,
        shipping_city=data.shipping_city,
        shipping_area=data.shipping_area,
        shipping_pincode=data.shipping_pincode
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # Save order items
    for oi_data in order_items_to_create:
        oi = OrderItem(order_id=order.id, **oi_data)
        db.add(oi)

    # Clear user's cart
    if target_uid:
        db.query(CartItem).filter(CartItem.user_id == target_uid).delete()
    elif target_sid:
        db.query(CartItem).filter(CartItem.session_id == target_sid).delete()

    db.commit()
    db.refresh(order)

    items_res = [OrderItemResponse(
        id=it.id,
        dish_id=it.dish_id,
        dish_name=it.dish_name,
        price=it.price,
        quantity=it.quantity,
        image=it.image,
        is_veg=it.is_veg
    ) for it in order.items]

    return OrderResponse(
        id=order.id,
        order_number=order.order_number,
        user_id=order.user_id,
        total_amount=order.total_amount,
        delivery_fee=order.delivery_fee,
        discount_amount=order.discount_amount,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        order_status=order.order_status,
        shipping_name=order.shipping_name,
        shipping_phone=order.shipping_phone,
        shipping_address=order.shipping_address,
        shipping_city=order.shipping_city,
        shipping_area=order.shipping_area,
        shipping_pincode=order.shipping_pincode,
        created_at=order.created_at,
        items=items_res
    )
