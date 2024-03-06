import React, { ChangeEvent, useState } from "react";
import { BiArrowBack } from "react-icons/bi";

function Shipping() {
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    house: "",
    city: "",
    state: "",
    pincode: "",
    country: ""
  });
  const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo((prev)=>({...prev, [e.target.name]:e.target.value}))
    
  };
  return (
    <div className="shipping">
      <button>
        <BiArrowBack />
      </button>

      <form>
        <h1>Shipping Address</h1>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={shippingInfo.name}
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
