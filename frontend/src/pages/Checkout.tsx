import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';


const stripePromise = loadStripe("ksksk")

const CheckoutForm = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const submitHandler = () => {}

  return (<div className='checkout-container'>
    <form onSubmit={submitHandler}>
      <PaymentElement/>
      <button>{isProcessing? "Processing...": "Pay"}</button>
    </form>
  </div>)
}

const Checkout = () => {
  return (
    <Elements stripe={stripePromise} options={{
      clientSecret: " "
    }}>
      <CheckoutForm/>
    </Elements>
  )
}

export default Checkout;