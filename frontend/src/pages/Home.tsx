import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

function Home() {

  const {data, isLoading, isError} = useLatestProductsQuery("");
  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if(cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addToCart(cartItem));
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
        {/* <ProductCard
          productId="productId"
          name="Gaming Laptop"
          photo="https://media.istockphoto.com/id/479520746/photo/laptop-with-blank-screen-on-white.jpg?s=612x612&w=0&k=20&c=V5dj0ayS8He0BP4x15WR5t5NKYzWTKv7VdWvD2SAVAM="
          price={14399}
          handler={addToCartHandler}
          stock={67}
        /> */}
      </main>
    </div>
  );
}

export default Home;
