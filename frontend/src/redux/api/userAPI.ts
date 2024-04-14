import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { AllUsersResponse, DeleteUserRequest, MessageResponse, UserResponse } from '../../types/api-types';
import { User } from '../../types/types';
import axios from 'axios';
 
const server = import.meta.env.VITE_SERVER;
// RTK query
// route: ${server-domain}/api/v1/user/new
export const userAPI = createApi({
  reducerPath: "userApi", 
  baseQuery: fetchBaseQuery({baseUrl: `${server}/v1/user/`}),
  tagTypes: ["users"],
  endpoints: (builder)=>({
    login: builder.mutation<MessageResponse, User>({
      query: (user)=>({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"]
    }),

    allUsers: builder.query<AllUsersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["users"]
    }),

    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({userId, adminId}) => ({
        url: `${userId}?id=${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"]
    })
  }) 
});


export const getUser = async (id: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const {data}: {data: UserResponse} = await axios.get(`${server}/v1/user/${id}`); 
    return data;   
  } catch (error) {
    throw error;
  }
}

export const {useLoginMutation, useAllUsersQuery, useDeleteUserMutation} = userAPI;