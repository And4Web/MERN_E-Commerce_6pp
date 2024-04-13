import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
// import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { server } from "../redux/store";
import { CartReducerInitialState } from "../types/reducer-types";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

function Shipping() {

  const { cartItems, total } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
      if(cartItems.length <= 0) return navigate("/cart")
    },[cartItems])
  
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    house: "",
    city: "",
    state: "",
    pincode: "",
    country: ""
  });
  
  const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo((prev)=>({...prev, [e.target.name]:e.target.value}))    
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingInfo(shippingInfo));

    try {
      const {data} = await axios.post(`${server}/v1/payments/create`, {
        amount: total,
      }, {
        headers: {
          "Content-Type":"application/json"
        }
      });

      navigate("/pay", {
        state: data?.clientSecret
      })
    } catch (error) {
      console.log("Shipping.tsx payment request error >>> ", error)
      // toast.error(error);
    }
  }

  return (
    <div className="shipping">
      <button className="back-btn" onClick={()=>navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>
        <input
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
          required
        />
        <select name="country" required value={shippingInfo.country} onChange={changeHandler}>
          <option value="">Choose Country</option>
          <option value="india">India</option>
          <option value="usa">USA</option>
          <option value="uk">UK</option>
        </select>
        <input
          type="text"
          placeholder="House"
          name="house"
          value={shippingInfo.house}
          onChange={changeHandler}
          required
        />
          <input
            type="text"
            placeholder="State"
            name="state"
            value={shippingInfo.state}
            onChange={changeHandler}
            required
          />
        <input
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
          required
        />
        
        <input
          type="text"
          placeholder="Pincode"
          name="pincode"
          value={shippingInfo.pincode}
          onChange={changeHandler}
          required
        />

        <button type="submit">Pay now</button>
        
      </form>
    </div>
  );
}

export default Shipping;
