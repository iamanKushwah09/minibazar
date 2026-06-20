import requests from "./httpService";

const SaleOrderServices = {
    getAllSaleOrder: async () => {
        return requests.get("/sale-order");
    },
    getSaleOrderById: async (id) => {
        return requests.get(`/sale-order/${id}`);
    },
    createSaleOrder: async (data) => {
        return requests.post("/sale-order", data);
    },
    updateSaleOrder: async (id, data) => {
        return requests.put(`/sale-order/${id}`, data);
    },
    deleteSaleOrder: async (id) => {
        return requests.delete(`/sale-order/${id}`);
    },
    searchSaleOrders: async (searchQuery) => {
        try {
            const response = await requests.get(`/sale-order/search?q=${encodeURIComponent(searchQuery)}`);
            return response;
        } catch (error) {
            console.error('Error searching sale orders:', error);
            throw error;
        }
    },
    dispatchUpdate: async (saleorderid , data)=>{
    return requests.patch(`/sale-order/${saleorderid}/dispatch` , data)
  },
  processSaleOrder: async (saleorderid) => {
    return requests.post(`/sale-order/process/${saleorderid}`);
  },
  // Date range filtering function
  getSaleOrdersByFilter: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add non-empty filter parameters
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
            queryParams.append(key, value);
        }
    });
    
    const queryString = queryParams.toString();
    const url = `/sale-order/filter${queryString ? `?${queryString}` : ''}`;
    
    console.log('Making API request to:', url, 'with filters:', filters);
    
    try {
        const response = await requests.get(url);
        
        // Log response for debugging
        console.log('Filter API response:', response);
        
        // Ensure consistent response format
        if (response.success !== undefined) {
            return response;
        } else if (Array.isArray(response)) {
            // Handle case where API returns array directly
            return {
                success: true,
                data: {
                    orders: response,
                    pagination: {
                        currentPage: 1,
                        totalPages: 1,
                        totalCount: response.length,
                        limit: filters.limit || 20,
                        hasNext: false,
                        hasPrev: false
                    },
                    summary: null
                }
            };
        } else {
            return response;
        }
    } catch (error) {
        console.error('Error in getSaleOrdersByFilter:', error);
        throw error;
    }
  }
};

export default SaleOrderServices;