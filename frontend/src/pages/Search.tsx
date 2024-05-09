import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Skeleton } from '../components/Loader';
import ProductCard from '../components/ProductCard';
import { useCategoriesQuery, useSearchProductsQuery } from '../redux/api/productAPI';
import { addToCart } from '../redux/reducer/cartReducer';
import { CustomError } from '../types/api-types';
import { CartItem } from '../types/types';

function Search() {

  const {data: categoriesResponse, isLoading: loadingCategories, isError: categoriesIsError, error: categoriesError} = useCategoriesQuery("");

  const server = import.meta.env.VITE_SERVER;
  

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const {data: searchedData, isLoading: productsLoading, isError: searchIsError, error: searchError} = useSearchProductsQuery({search, price: maxPrice, category, sort, page});

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem):undefined => {
    if(cartItem.stock < 1) toast.error("Out of stock.");

    dispatch(addToCart(cartItem));
    toast.success(`${cartItem.name} added to your cart.`)
  }

  const isFirstPage = page <= 1; 
  const isLastPage = page >= searchedData!.currentPage;  

  if(categoriesIsError){
    const err = categoriesError as CustomError;
    toast.error(err.data.message);
  }

  if(searchIsError){
    const err = searchError as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className='product-search'>
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e)=>e.target.value}>
            <option value="">None</option>
            <option value="asc">Price - Low to High</option>
            <option value="dsc">Price - High to Low</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input type="range" min={100} max={1000000} value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))}/>
        </div>
        <div>
          <h4>Category</h4>
          <select value={category} onChange={(e)=>e.target.value}>
            <option value="">All</option>
            {loadingCategories === false && categoriesResponse?.categories.map((i)=>{
              return (
                <option key={i} value={i}>{i.toUpperCase()}</option>
              )
            })}
            
          </select>
        </div>
      </aside>


      <main>
        <h1>Products</h1>
        <input type="text" placeholder='Search products by name...' value={search} onChange={(e)=>setSearch(e.target.value)}/>
        {
          productsLoading ? <Skeleton/> : (
            <div className="search-product-list">

          {
            searchedData?.searchedProducts.map((i)=>{
              const photoUrl = `${i.photo}`.split("\\").join("/");
              console.log(photoUrl)
              return (
                <ProductCard 
            productId={i._id}
            name={i.name}
            price={i.price}
            stock={i.stock}
            handler={addToCartHandler}
            photo={photoUrl}
          />
              )
            })
          }
        </div>
          )
        }

        {
          (searchedData && searchedData?.totalPages >= 1) &&
            (<article>
            <button disabled={isFirstPage} onClick={()=>setPage(curr=>curr-1)}>Prev</button>
            <span>{page} of {searchedData?.totalPages}</span>
            <button disabled={isLastPage} onClick={()=>setPage(curr=>curr+1)}>Next</button>
          </article>
          )
        }
      </main>
    </div>
  )
}

export default Search