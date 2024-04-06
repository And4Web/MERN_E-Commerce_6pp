import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CartItem } from '../types/types';

type CartItemProps = {
  cartItem: any;
  incrementHandler: (cartItem: CartItem) => void;
  decrementHandler: (cartItem: CartItem) => void;
  removeHandler: (id: string) => void;
}

function CartItemCard({cartItem, incrementHandler, decrementHandler, removeHandler}: CartItemProps) {

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
        <button onClick={()=>decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={()=>incrementHandler(cartItem)}>+</button>
      </div>

      <button onClick={()=>removeHandler(productId)}><FaTrash/></button>
    </div>
  )
}

export default CartItemCard