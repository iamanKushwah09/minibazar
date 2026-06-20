import { createApi } from '@reduxjs/toolkit/query/react';
import requests from '../../services/httpService';

const axiosBaseQuery =
  () =>
  async ({ url, method, data, params }) => {
    try {
      let result;
      switch (method) {
        case 'GET':
          result = await requests.get(url, { params });
          break;
        case 'POST':
          result = await requests.post(url, data);
          break;
        case 'PUT':
          result = await requests.put(url, data);
          break;
        case 'DELETE':
          result = await requests.delete(url, data);
          break;
        default:
          result = await requests.get(url, { params });
      }
      return { data: result };
    } catch (axiosError) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };

export const shippingApiSlice = createApi({
  reducerPath: 'shippingApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Settings', 'Pharmacy', 'Rules'],
  endpoints: (builder) => ({
    getShippingSettings: builder.query({
      query: () => ({ url: '/admin/shipping/settings', method: 'GET' }),
      providesTags: ['Settings'],
    }),
    updateShippingSettings: builder.mutation({
      query: (data) => ({ url: '/admin/shipping/settings', method: 'PUT', data }),
      invalidatesTags: ['Settings'],
    }),
    getPharmacySettings: builder.query({
      query: () => ({ url: '/admin/shipping/pharmacy/settings', method: 'GET' }),
      providesTags: ['Pharmacy'],
    }),
    updatePharmacySettings: builder.mutation({
      query: (data) => ({ url: '/admin/shipping/pharmacy/settings', method: 'PUT', data }),
      invalidatesTags: ['Pharmacy'],
    }),
    getShippingRules: builder.query({
      query: () => ({ url: '/admin/shipping/shipping-rules', method: 'GET' }),
      providesTags: ['Rules'],
    }),
    createShippingRule: builder.mutation({
      query: (data) => ({ url: '/admin/shipping/shipping-rules', method: 'POST', data }),
      invalidatesTags: ['Rules'],
    }),
    updateShippingRule: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/admin/shipping/shipping-rules/${id}`, method: 'PUT', data }),
      invalidatesTags: ['Rules'],
    }),
    deleteShippingRule: builder.mutation({
      query: (id) => ({ url: `/admin/shipping/shipping-rules/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Rules'],
    }),
  }),
});

export const {
  useGetShippingSettingsQuery,
  useUpdateShippingSettingsMutation,
  useGetPharmacySettingsQuery,
  useUpdatePharmacySettingsMutation,
  useGetShippingRulesQuery,
  useCreateShippingRuleMutation,
  useUpdateShippingRuleMutation,
  useDeleteShippingRuleMutation,
} = shippingApiSlice;
