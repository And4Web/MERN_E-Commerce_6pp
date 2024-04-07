import { configureStore } from "@reduxjs/toolkit";
import { productAPI } from "./api/productAPI";
import { userAPI } from "./api/userAPI";
import {orderAPI} from './api/orderAPI';
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";


export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer, 
    [orderAPI.reducerPath]: orderAPI.reducer,
    [userReducer.name]: userReducer.reducer,
    [cartReducer.name]: cartReducer.reducer, 
  },
  middleware: (mid) => [...mid(), userAPI.middleware, productAPI.middleware, orderAPI.middleware],
});