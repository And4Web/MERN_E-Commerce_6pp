import { FaPlus } from "react-icons/fa";

type ProductsProps = {
  productId: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
  handler: () => void;
}

const server = import.meta.env.VITE_SERVER;
console.log("server: ", server)

function ProductCard({productId, name, photo, price, handler, stock}: ProductsProps) {
  return (
    <div className="product-card">
      <img src={`${server}/v1/${photo}`} alt={name} />
      <span>{stock && ` (in Stock)`}</span>
      <p>{name}</p>
      <span>&#8377;{price}</span>
      <div>
        <button onClick={()=>handler()}><FaPlus/></button>
      </div>
    </div>
  )
}

export default ProductCard