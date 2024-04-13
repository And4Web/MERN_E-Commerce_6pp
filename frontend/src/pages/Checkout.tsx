import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { NewOrderRequest } from '../types/api-types';
import { useDispatch, useSelector } from 'react-redux';
import { CartReducerInitialState, UserReducerInitialState } from '../types/reducer-types';
import { RootState } from '@reduxjs/toolkit/query';
import { useNewOrderMutation } from '../redux/api/orderAPI';
import { resetCart } from '../redux/reducer/cartReducer';
import { responseToast } from '../utils/features';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {user} = useSelector((state: {userReducer: UserReducerInitialState})=>state.userReducer);

  const {shippingInfo, shippingCharges, subtotal, tax, discount, total, cartItems} = useSelector((state: {cartReducer: CartReducerInitialState})=>state.cartReducer);

  const [newOrder] = useNewOrderMutation();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!stripe || !elements) return;
    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      userId: user?._id as string
    };

    const {paymentIntent, error} = await stripe.confirmPayment({
      elements,
      confirmParams: {return_url: window.location.origin},
      redirect: "if_required",
    });

    if(error){
      setIsProcessing(false);
      return toast.error(error.message || "Something went wrong with payment."); 
    } 
    
    if(paymentIntent.status === 'succeeded'){
      const res = await newOrder(orderData);
      dispatch(resetCart());
      responseToast(res, navigate, "/orders");

      console.log("payment done, order placed successfully.")
      // navigate("/orders");
    }

    setIsProcessing(false);
  }

  return (<div className='checkout-container'>
    <form onSubmit={submitHandler}>
      <PaymentElement/>
      <button type='submit' disabled={isProcessing}>{isProcessing? "Processing...": "Pay"}</button>
    </form>
  </div>)
}

const Checkout = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state;

  if(!clientSecret) return <Navigate to={"/shipping"}/>;

  return (
    <Elements stripe={stripePromise} options={{
      clientSecret
    }}>
      <CheckoutForm/>
    </Elements>
  )
}

export default Checkout;