import { createApi } from '@reduxjs/toolkit/query/react';
import api from '../../services/api';

const axiosBaseQuery =
  () =>
  async ({ url, method, data, params }: any) => {
    try {
      const result = await api({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError: any) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };

export const clientShippingApiSlice = createApi({
  reducerPath: 'clientShippingApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    calculateShipping: builder.mutation({
      query: (data: { latitude: number; longitude: number; orderAmount: number }) => ({
        url: '/shipping/calculate',
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const { useCalculateShippingMutation } = clientShippingApiSlice;
