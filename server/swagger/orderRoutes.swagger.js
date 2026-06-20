const orderRoutesSwagger = {
  tags: [
    {
      name: 'OrderRoutes',
      description: 'APIs for managing orders and dashboard statistics',
    },
  ],
  paths: {
    '/api/orders': {
      get: {
        summary: 'Get all orders',
        tags: ['OrderRoutes'],
        responses: {
          200: {
            description: 'List of all orders',
          },
        },
      },
    },
    '/api/orders/dashboard': {
      get: {
        summary: 'Get dashboard order data',
        tags: ['OrderRoutes'],
        responses: {
          200: {
            description: 'Dashboard order statistics',
          },
        },
      },
    },
    '/api/orders/dashboard-recent-order': {
      get: {
        summary: 'Get recent dashboard orders',
        tags: ['OrderRoutes'],
        responses: {
          200: {
            description: 'List of recent orders',
          },
        },
      },
    },
    '/api/orders/dashboard-count': {
      get: {
        summary: 'Get total order count for dashboard',
        tags: ['OrderRoutes'],
        responses: {
          200: {
            description: 'Total order count',
          },
        },
      },
    },
    '/api/orders/dashboard-amount': {
      get: {
        summary: 'Get total amount from orders for dashboard',
        tags: ['OrderRoutes'],
        responses: {
          200: {
            description: 'Total amount from orders',
          },
        },
      },
    },
    '/api/orders/best-seller/chart': {
      get: {
        summary: 'Get best selling product chart data',
        tags: ['OrderRoutes'],
        responses: {
          200: {
            description: 'Best seller product chart data',
          },
        },
      },
    },
    '/api/orders/customer/{id}': {
      get: {
        summary: 'Get all orders by customer ID',
        tags: ['OrderRoutes'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Customer ID',
          },
        ],
        responses: {
          200: {
            description: 'List of orders by customer',
          },
        },
      },
    },
    '/api/orders/{id}': {
      get: {
        summary: 'Get an order by ID',
        tags: ['OrderRoutes'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Order ID',
          },
        ],
        responses: {
          200: {
            description: 'Order retrieved successfully',
          },
        },
      },
      put: {
        summary: 'Update an order by ID',
        tags: ['OrderRoutes'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Order ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  status: 'delivered',
                  paymentStatus: 'paid',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Order updated successfully',
          },
        },
      },
      delete: {
        summary: 'Delete an order by ID',
        tags: ['OrderRoutes'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Order ID',
          },
        ],
        responses: {
          200: {
            description: 'Order deleted successfully',
          },
        },
      },
    },
  },
};

module.exports = orderRoutesSwagger;
