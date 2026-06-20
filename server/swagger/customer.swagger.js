const customerSwagger = {
  tags: [
    {
      name: 'Customer',
      description: 'API for managing customers',
    },
  ],
  paths: {
    '/api/customer/refresh': {
      get: {
        tags: ['Customer'],
        summary: 'Get busy refresh data',
        responses: {
          200: {
            description: 'Refresh data fetched successfully',
          },
        },
      },
    },

    '/api/customer/party-ledger': {
      post: {
        tags: ['Customer'],
        summary: 'Get party ledger for a customer',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  customerId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Ledger data returned',
          },
        },
      },
    },

    '/api/customer': {
      post: {
        tags: ['Customer'],
        summary: 'Create a new customer',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Customer created',
          },
        },
      },
      get: {
        tags: ['Customer'],
        summary: 'Get all customers',
        responses: {
          200: {
            description: 'List of customers',
          },
        },
      },
    },

    '/api/customer/{id}': {
      get: {
        tags: ['Customer'],
        summary: 'Get a customer by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Customer ID',
          },
        ],
        responses: {
          200: {
            description: 'Customer details',
          },
        },
      },
      put: {
        tags: ['Customer'],
        summary: 'Update a customer by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Customer ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Customer updated',
          },
        },
      },
      delete: {
        tags: ['Customer'],
        summary: 'Delete a customer by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Customer ID',
          },
        ],
        responses: {
          200: {
            description: 'Customer deleted',
          },
        },
      },
    },
  },
};

module.exports = customerSwagger;
