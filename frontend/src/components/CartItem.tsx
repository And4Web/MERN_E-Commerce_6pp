import React from 'react';
import { FaTrash } from 'react-icons/fa';
import {Link} from 'react-router-dom';

type CartItemProps = {
  cartItem: any;
}

function CartItem({cartItem}: CartItemProps) {
  const server = `${import.meta.env.VITE_SERVER}`;  
  const {productId, name, photo, price, quantity} = cartItem;
  return (
    <div className='cart-item'>
      <img src={`${server}/v1/${photo.split("\\").join("/")}`} alt={name} />
      
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>&#8377;{price}</span>
      </article>

      <div>
        <button>-</button>
        <p>{quantity}</p>
        <button>+</button>
      </div>

      <button><FaTrash/></button>
    </div>
  )
}

export default CartItem