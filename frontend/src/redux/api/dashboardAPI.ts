import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { BarChartResponse, DashboardStatsResponse, LineChartResponse, PieChartResponse } from '../../types/api-types';

const server = import.meta.env.VITE_SERVER;

export const dashboardAPI = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({baseUrl: `${server}/v1/dashboard/`}),
  tagTypes: ["dashboard"],
  endpoints: (builder)=>({
    stats: builder.query<DashboardStatsResponse, string>({
      query: id => `stats?id=${id}`,
      providesTags: ["dashboard"],
    }),
    pie: builder.query<PieChartResponse, string>({
      query: id => `pie?id=${id}`,
      providesTags: ["dashboard"],
    }),
    bar: builder.query<BarChartResponse, string>({
      query: id => `bar?id=${id}`,
      providesTags: ["dashboard"],
    }),
    line: builder.query<LineChartResponse, string>({
      query: id => `line?id=${id}`,
      providesTags: ["dashboard"],
    })
  }),

})

export const {useStatsQuery, useBarQuery, useLineQuery, usePieQuery} = dashboardAPI;


