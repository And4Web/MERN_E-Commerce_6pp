import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { LatestProductsResponse, MessageResponse } from '../../types/api-types';
import { Product } from '../../types/types';
import { userAPI } from './userAPI';

const server = import.meta.env.VITE_SERVER;

// RTK query
// route: ${server-domain}/api/v1/product/
export const productAPI = createApi({
  reducerPath:"productAPI",
  baseQuery: fetchBaseQuery({baseUrl: `${server}/v1/products/`}),
  endpoints: (builder) => (
    {
      newProduct: builder.mutation<MessageResponse, Product>({
        query: (product)=>({
          url: "new",
          method: "POST",
          body: product
        })
      }),
      latestProducts: builder.query<LatestProductsResponse, string>({
        query: () => "latest"
      })
    }
  )
})

export const {useLatestProductsQuery, } = productAPI;