const ordersSwagger = {
  tags: [
    {
      name: 'Orders',
      description: 'All operations related to orders',
    },
  ],
  paths: {
    '/api/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  quantity: { type: 'integer' },
                },
                required: ['product', 'quantity'],
                example: {
                  product: '64fa290e58a70e3e282c649f',
                  quantity: 2,
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Order created successfully',
          },
        },
      },
      get: {
        tags: ['Orders'],
        summary: 'Get all orders',
        responses: {
          200: {
            description: 'List of all orders',
          },
        },
      },
    },
    '/api/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get an order by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Order details',
          },
        },
      },
      put: {
        tags: ['Orders'],
        summary: 'Update an order by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  quantity: { type: 'integer' },
                },
                required: ['product', 'quantity'],
                example: {
                  product: '64fa290e58a70e3e282c649f',
                  quantity: 3,
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
        tags: ['Orders'],
        summary: 'Delete an order by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
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

module.exports = ordersSwagger;
