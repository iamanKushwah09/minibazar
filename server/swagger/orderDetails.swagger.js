const orderDetailsSwagger = {
  tags: [
    {
      name: 'OrderDetails',
      description: 'APIs for managing order details',
    },
  ],
  paths: {
    '/api/order-details': {
      post: {
        tags: ['OrderDetails'],
        summary: 'Create new order details',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  orderId: { type: 'string' },
                  itemId: { type: 'string' },
                  quantity: { type: 'integer' },
                  price: { type: 'number' },
                },
                required: ['orderId', 'itemId', 'quantity', 'price'],
                example: {
                  orderId: '64fdb16e30a4f0d3a9a271c3',
                  itemId: '64fbf282ff1e1b232ea3d9b8',
                  quantity: 2,
                  price: 199.99,
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Order details created successfully',
          },
        },
      },
      get: {
        tags: ['OrderDetails'],
        summary: 'Get all order details',
        responses: {
          200: {
            description: 'List of all order details',
          },
        },
      },
    },
    '/api/order-details/{id}': {
      get: {
        tags: ['OrderDetails'],
        summary: 'Get order details by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Order details ID',
          },
        ],
        responses: {
          200: {
            description: 'Order details retrieved successfully',
          },
        },
      },
      put: {
        tags: ['OrderDetails'],
        summary: 'Update order details by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Order details ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  itemId: { type: 'string' },
                  quantity: { type: 'integer' },
                  price: { type: 'number' },
                },
                example: {
                  itemId: '64fbf282ff1e1b232ea3d9b8',
                  quantity: 3,
                  price: 150.0,
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Order details updated successfully',
          },
        },
      },
      delete: {
        tags: ['OrderDetails'],
        summary: 'Delete order details by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Order details ID',
          },
        ],
        responses: {
          200: {
            description: 'Order details deleted successfully',
          },
        },
      },
    },
  },
};

module.exports = orderDetailsSwagger;
