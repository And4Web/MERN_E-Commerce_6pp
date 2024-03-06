import React, { useEffect, useState } from 'react';
import { VscError } from 'react-icons/vsc';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';

const cartItems = [
  {
    productId: "productId",
    name: "Gaming Laptop",
    photo: "https://media.istockphoto.com/id/479520746/photo/laptop-with-blank-screen-on-white.jpg?s=612x612&w=0&k=20&c=V5dj0ayS8He0BP4x15WR5t5NKYzWTKv7VdWvD2SAVAM=",
    price: 14399,
    stock: 67,
    quantity: 2,
  }
 
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 200;
const discount = 400;
const total = subtotal + tax;

function Cart() {
  const [couponCode, setCouponCode] = useState<string>("")
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(()=>{
    const timeoutId = setTimeout(()=>{
      if(Math.random() > 0.5) {
        setIsValidCouponCode(true);
        setCouponCode(couponCode)
      }else {
        setIsValidCouponCode(false);
        setCouponCode("")
      }
    }, 500);


    return ()=>{
      clearTimeout(timeoutId);
      setIsValidCouponCode(false)
    }
  }, [couponCode])

  return (
    <div className='cart'>
      <main>

        {cartItems.length>0 ? cartItems.map((item,index)=>{
          return <CartItem key={index} cartItem={item}/>;
        }):<h1>No items in your Cart, Continue shopping.</h1>}

      </main>
      <aside>
        <p>Sub total: &#8377;{subtotal}</p>
        <p>Shipping Charges: &#8377;{shippingCharges}</p>
        <p>Tax: &#8377;{tax}</p>
        <p>Discount: <em className='red'>-&#8377;{discount}</em></p>
        <p><b>Total: &#8377;{total}</b></p>

        <input type="text" placeholder='Coupon Code' value={couponCode} onChange={(e)=>setCouponCode(e.target.value)}/>

        {couponCode && (
          isValidCouponCode ? <span className='green'>&#8377;{discount} off using the Coupon: '<code>{couponCode}</code>'</span> : <span className='red'>Invalid Coupon <VscError/></span>
        )}

        {
          cartItems.length > 0 && <Link to="/shipping">Checkout</Link>
        }

      </aside>
    </div>
  )
}

export default Cart