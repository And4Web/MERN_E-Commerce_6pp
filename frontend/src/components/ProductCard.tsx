import { FaPlus } from "react-icons/fa";

type ProductsProps = {
  productId: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
  handler: () => void;
}

// const server = "akjsdfk_askdjfkasdufkasdk";

function ProductCard({productId, name, photo, price, handler, stock}: ProductsProps) {
  return (
    <div className="product-card">
      <img src={photo} alt={name} />
      <span>{stock && ` (in Stock)`}</span>
      <p>{name}-{productId}</p>
      <span>&#8377;{price}</span>
      <div>
        <button onClick={()=>handler()}><FaPlus/></button>
      </div>
    </div>
  )
}

export default ProductCard