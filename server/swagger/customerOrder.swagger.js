const customerOrderSwagger = {
  tags: [
    {
      name: 'CustomerOrder',
      description: 'API for handling customer orders and payments',
    },
  ],
  paths: {
    '/api/order/add': {
      post: {
        tags: ['CustomerOrder'],
        summary: 'Add a new order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  customerId: { type: 'string' },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string' },
                        quantity: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Order created',
          },
        },
      },
    },

    '/api/order/create-payment-intent': {
      post: {
        tags: ['CustomerOrder'],
        summary: 'Create a Stripe payment intent',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Payment intent created',
          },
        },
      },
    },

    '/api/order/add/razorpay': {
      post: {
        tags: ['CustomerOrder'],
        summary: 'Add an order through Razorpay',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'number' },
                  currency: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Razorpay order added',
          },
        },
      },
    },

    '/api/order/create/razorpay': {
      post: {
        tags: ['CustomerOrder'],
        summary: 'Create an order by Razorpay',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  razorpayPaymentId: { type: 'string' },
                  razorpayOrderId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Order created using Razorpay',
          },
        },
      },
    },

    '/api/order/{id}': {
      get: {
        tags: ['CustomerOrder'],
        summary: 'Get an order by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: { type: 'string' },
            required: true,
            description: 'Order ID',
          },
        ],
        responses: {
          200: {
            description: 'Order details',
          },
        },
      },
    },

    '/api/order': {
      get: {
        tags: ['CustomerOrder'],
        summary: 'Get all orders by a user',
        responses: {
          200: {
            description: 'List of user orders',
          },
        },
      },
    },
  },
};

module.exports = customerOrderSwagger;
