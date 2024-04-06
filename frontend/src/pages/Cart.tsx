import React, { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import CartItemCard from "../components/CartItem";
import { CartItem } from "../types/types";
import { addToCart, removeCartItem } from "../redux/reducer/cartReducer";

function Cart() {
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {
    if(+cartItem.quantity >= cartItem.stock) return;

    dispatch(addToCart({...cartItem, quantity: cartItem.quantity + 1}));
  }
  const decrementHandler = (cartItem: CartItem) => {
    dispatch(addToCart({...cartItem, quantity: +cartItem.quantity > 1 ? +cartItem.quantity - 1 : 1}))

    if(cartItem.quantity === 1) dispatch(removeCartItem(cartItem.productId));
  }
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  }


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Math.random() > 0.5) {
        setIsValidCouponCode(true);
        setCouponCode(couponCode);
      } else {
        setIsValidCouponCode(false);
        setCouponCode("");
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => {
            return <CartItemCard key={index} cartItem={item} incrementHandler={incrementHandler} decrementHandler={decrementHandler} removeHandler={removeHandler}/>;
          })
        ) : (
          <h1>No items in your Cart, Continue shopping.</h1>
        )}
      </main>
      <aside>
        <p>Sub total: &#8377;{subtotal}</p>
        <p>Shipping Charges: &#8377;{shippingCharges}</p>
        <p>Tax: &#8377;{tax}</p>
        <p>
          Discount: <em className="red">-&#8377;{discount}</em>
        </p>
        <p>
          <b>Total: &#8377;{total}</b>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              &#8377;{discount} off using the Coupon: '<code>{couponCode}</code>
              '
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
}

export default Cart;
