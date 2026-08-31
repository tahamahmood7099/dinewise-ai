import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Order, OrderItem, Product, CartItem, Interaction
from ..schemas import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders & Simulated Checkout"])

@router.post("", response_model=OrderResponse)
def create_order(
    order_in: OrderCreate,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    # Generate unique Indian order number
    order_num = f"BK-IND-{random.randint(100000, 999999)}"

    # Fetch products and calculate total
    total_amount = 0.0
    order_items_to_create = []

    for item in order_in.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")

        item_total = product.price * item.quantity
        total_amount += item_total

        order_items_to_create.append({
            "product_id": product.id,
            "product_name": product.name,
            "price": product.price,
            "quantity": item.quantity,
            "image": product.image
        })

    # Create Order record
    new_order = Order(
        order_number=order_num,
        user_id=user_id,
        session_id=order_in.session_id,
        total_amount=round(total_amount, 2),
        discount_amount=0.0,
        payment_method=order_in.payment_method,
        payment_status="Completed",
        order_status="Confirmed",
        shipping_name=order_in.shipping_name,
        shipping_phone=order_in.shipping_phone,
        shipping_address=order_in.shipping_address,
        shipping_city=order_in.shipping_city,
        shipping_state=order_in.shipping_state,
        shipping_pincode=order_in.shipping_pincode
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Create OrderItems and log Purchase interactions
    for oi_data in order_items_to_create:
        oi = OrderItem(
            order_id=new_order.id,
            product_id=oi_data["product_id"],
            product_name=oi_data["product_name"],
            price=oi_data["price"],
            quantity=oi_data["quantity"],
            image=oi_data["image"]
        )
        db.add(oi)

        # Log purchase interaction with high weight (10.0)
        interaction = Interaction(
            user_id=user_id,
            session_id=order_in.session_id,
            product_id=oi_data["product_id"],
            interaction_type="purchase",
            weight=10.0
        )
        db.add(interaction)

    # Clear user's cart
    if user_id:
        db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    elif order_in.session_id:
        db.query(CartItem).filter(CartItem.session_id == order_in.session_id).delete()

    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("", response_model=List[OrderResponse])
def get_orders(
    user_id: Optional[int] = None,
    session_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Order)
    if user_id:
        query = query.filter(Order.user_id == user_id)
    elif session_id:
        query = query.filter(Order.session_id == session_id)
    else:
        return []
    return query.order_by(Order.created_at.desc()).all()

@router.get("/{order_number}", response_model=OrderResponse)
def get_order_by_number(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
