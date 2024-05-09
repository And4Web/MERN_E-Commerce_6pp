import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";

function Home() {

  const {data, isLoading, isError} = useLatestProductsQuery("");
  const dispatch = useDispatch(); 

  const addToCartHandler = (cartItem: CartItem):undefined => {
    if(cartItem.stock < 1) toast.error("Out of Stock");
    // if(cartItem)

    dispatch(addToCart(cartItem));
    toast.success(`${cartItem.name} added to cart.`)
  }
  
  if(isError) toast.error("Can not fetch data from server.")
    
  return (
    <div className="home">
      {/* cover image  */}
      <section></section>

      {/* title and search button - more */}
      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>
      
      {/* products from product array from database */}
      <main>
      
        {
         isLoading? (<Skeleton width="80vw"/>) : data?.latestProducts.map((p)=>(
            <ProductCard
              key={p._id}
              productId={p._id}
              name={p.name}
              photo={p?.photo}
              price={p.price}
              handler={addToCartHandler}
              stock={p.stock}
            />
          ))
        }
      </main>
    </div>
  );
}

export default Home;
