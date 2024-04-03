import React, { useState } from 'react'
import ProductCard from '../components/ProductCard';
import { useCategoriesQuery, useSearchProductsQuery } from '../redux/api/productAPI';
import { CustomError } from '../types/api-types';
import toast from 'react-hot-toast';

function Search() {

  const {data: categoriesResponse, isLoading: loadingCategories, isError, error} = useCategoriesQuery("");

  const server = import.meta.env.VITE_SERVER;


  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);


  const {data: searchedData, isLoading: productsLoading} = useSearchProductsQuery({search, price: maxPrice, category, sort, page});

  console.log("search: ", server);

  const addToCartHandler = () => {console.log("add to cart from search...")}

  const isFirstPage = page <= 1;
  const isLastPage = page >= 4;

  if(isError){
    const err = error as CustomError;
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
          <input type="range" min={100} max={100000} value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))}/>
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


        <article>
          <button disabled={isFirstPage} onClick={()=>setPage(curr=>curr-1)}>Prev</button>
          <span>{page} of {4}</span>
          <button disabled={isLastPage} onClick={()=>setPage(curr=>curr+1)}>Next</button>
        </article>
      </main>
    </div>
  )
}

export default Search