import api from './api';

export class OrderService {
  // Add a new order
  static async addOrder(orderData: any, headers?: any): Promise<any> {
    const response = await api.post<any>('/order/add', orderData, { headers });
    return response.data;
  }

  // Get orders for the current customer
  static async getCustomerOrders(page: number = 1, limit: number = 8): Promise<any> {
    const response = await api.get<any>(`/order?limit=${limit}&page=${page}`);
    return response.data;
  }

  // Get a specific order by ID
  static async getOrderById(id: string): Promise<any> {
    const response = await api.get<any>(`/order/${id}`);
    return response.data;
  }

  // Get sale order customer info
  static async getSaleOrderCustomer(customerId: string): Promise<any> {
    const response = await api.get<any>(`/sale-order/customer/${customerId}`);
    return response.data;
  }

  // Get sale order history
  static async getSaleOrderHistory(customerId: string, page: number = 1, limit: number = 10): Promise<any> {
    const response = await api.get<any>(`/sale-order/customer/${customerId}/history?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Send invoice email
  static async sendInvoiceEmail(body: any): Promise<any> {
    const response = await api.post<any>('/order/customer/invoice', body);
    return response.data;
  }
}

export default OrderService;