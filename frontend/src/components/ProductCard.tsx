import { FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";

type ProductsProps = {
  productId: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
}

const server = import.meta.env.VITE_SERVER;

function ProductCard({productId, name, photo, price, handler, stock}: ProductsProps) {
  return (
    <div className="product-card">
      <img src={`${server}/v1/${photo}`} alt={name} />
      <span>{stock && ` (in Stock)`}</span>
      <p>{name}</p>
      <span>&#8377;{price}</span>
      <div>
        <button onClick={()=>handler({productId, name, photo, price, stock, quantity: 1})}><FaPlus/></button>
      </div>
    </div>
  )
}

export default ProductCard