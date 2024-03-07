import React, { useState } from 'react'
import ProductCard from '../components/ProductCard';

function Search() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const addToCartHandler = () => {console.log("add to cart from search...")}

  const isFirstPage = page <= 1;
  const isLastPage = page >= 4;

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
            <option value="camera">Camera</option>
            <option value="laptop">Laptop</option>
            <option value="smartphone">Smartphone</option>
            <option value="smartTv">Smart-TV</option>
          </select>
        </div>
      </aside>


      <main>
        <h1>Products</h1>
        <input type="text" placeholder='Search products by name...' value={search} onChange={(e)=>setSearch(e.target.value)}/>

        <div className="search-product-list">

          <ProductCard 
            productId='asdf'
            name="Laptop"
            price={89988}
            stock={76}
            handler={addToCartHandler}
            photo='https://media.istockphoto.com/id/479520746/photo/laptop-with-blank-screen-on-white.jpg?s=612x612&w=0&k=20&c=V5dj0ayS8He0BP4x15WR5t5NKYzWTKv7VdWvD2SAVAM='
          />
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