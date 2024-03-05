import React from 'react';
import {Link} from 'react-router-dom';

function Home() {
  return (
    <div className='home'>
{/* cover image  */}
      <section></section>

{/* title and search button - more */}
      <h1>
        Latest Products
        <Link to="/search" className='findmore'>More</Link>
      </h1>

{/* products from product array from database */}
      <main></main>
    </div>
  )
}

export default Home