import React, { lazy, Suspense } from "react";
import { BrowserRouter as BR, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));

import Loader from "./components/Loader";

const App = () => {
  return (
    <BR>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Suspense>
    </BR>
  );
};

export default App;
