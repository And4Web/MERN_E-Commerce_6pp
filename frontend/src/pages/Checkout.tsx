import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { NewOrderRequest } from '../types/api-types';


const stripePromise = loadStripe("pk_test_51Kgq7xSHQQYrsowjnmyKlOpABSmGfMxBVPz0pvAEbcq98H9VQyTvWhS0e875gXoHGftuHvCOdwvIFKqSSzf6NHtk00ipPXCdlp")

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!stripe || !elements) return;
    setIsProcessing(true);

    const orderData: NewOrderRequest = {};

    const {paymentIntent, error} = await stripe.confirmPayment({
      elements,
      confirmParams: {return_url: window.location.origin},
      redirect: "if_required",
    });

    if(error){
      setIsProcessing(false);
      return toast.error(error.message || "Something went wrong with payment method."); 
    } 
    
    if(paymentIntent.status === 'succeeded'){
      console.log("payment done, order placed successfully.")
      navigate("/orders");
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