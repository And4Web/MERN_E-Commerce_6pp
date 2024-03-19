import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { MessageResponse, UserResponse } from '../../types/api-types';
import { User } from '../../types/types';
import axios from 'axios';
 
const server = import.meta.env.VITE_SERVER;
// RTK query
// route: ${server-domain}/api/v1/user/new
export const userAPI = createApi({
  reducerPath: "userApi", 
  baseQuery: fetchBaseQuery({baseUrl: `${server}/v1/user/`}),
  endpoints: (builder)=>({
    login: builder.mutation<MessageResponse, User>({
      query: (user)=>({
        url: "new",
        method: "POST",
        body: user,
      })
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

export const {useLoginMutation} = userAPI;