import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { AllProductsResponse, CategoriesResponse, LatestProductsResponse, MessageResponse, SearchProductsRequest, SearchProductsResponse} from '../../types/api-types';
import { Product } from '../../types/types';
// import { userAPI } from './userAPI';

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
      }),

      adminAllProducts: builder.query<AllProductsResponse, string>({
        query: (id) => `admin-products?id=${id}`
      }),

      categories: builder.query<CategoriesResponse, string>({
        query: () => "categories"
      }),

      searchProducts: builder.query<SearchProductsResponse, SearchProductsRequest>({
        query: ({search, price, category, sort, page}) => {
          let base = `search?search=${search}&page=${page}`;

          if(price) base += `&price=${price}`;
          if(sort) base += `&sort=${sort}`;
          if(category) base += `&category=${category}`;

          return base;
        },         
      })
    }
  )
})

export const {useLatestProductsQuery, useAdminAllProductsQuery, useCategoriesQuery, useSearchProductsQuery} = productAPI;

