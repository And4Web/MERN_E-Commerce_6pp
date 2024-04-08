import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { AllOrdersResponse, MessageResponse, NewOrderRequest, OrderDetailsResponse, UpdateOrderRequest } from '../../types/api-types';

const server = import.meta.env.VITE_SERVER;

export const orderAPI = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({baseUrl: `${server}/v1/orders/`}), 
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (order) => ({url: "new", method: "POST", body: order}),
      invalidatesTags: ["orders"],
    }),

    myOrdersUser: builder.query<AllOrdersResponse, string>({
      query: (userId) => `my-orders?id=${userId}`,
      providesTags: ["orders"],
    }),

    myOrdersAdmin: builder.query<AllOrdersResponse, string>({
      query: (adminId)=>`all-orders?id=${adminId}`,
      providesTags: ["orders"],
    }),

    orderDetails: builder.query<OrderDetailsResponse, string>({
      query: (orderId) => orderId,
      providesTags: ["orders"],
    }),

    updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({orderId, adminId}) => ({
        url: `${orderId}?id=${adminId}`,
        method: "PUT",
      }), 
      invalidatesTags: ["orders"],
    }),

    deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({orderId, adminId}) => ({
        url: `${orderId}?id=${adminId}`,
        method: "DELETE",
      }), 
      invalidatesTags: ["orders"],
    })

  }),
})

export const {useNewOrderMutation, useUpdateOrderMutation, useDeleteOrderMutation, useMyOrdersAdminQuery, useMyOrdersUserQuery, useOrderDetailsQuery} = orderAPI;