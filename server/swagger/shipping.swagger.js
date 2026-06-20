const shippingSwagger = {
  tags: [
    {
      name: 'Shipping',
      description: 'API for managing shipping methods and configurations',
    },
  ],
  paths: {
    '/api/shipping': {
      post: {
        summary: 'Create a new shipping method',
        tags: ['Shipping'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  name: 'Express Delivery',
                  price: 50,
                  estimatedDays: 2,
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Shipping method created successfully',
          },
        },
      },
      get: {
        summary: 'Get all shipping methods',
        tags: ['Shipping'],
        responses: {
          200: {
            description: 'List of shipping methods',
          },
        },
      },
    },
    '/api/shipping/{id}': {
      get: {
        summary: 'Get a shipping method by ID',
        tags: ['Shipping'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            description: 'ID of the shipping method',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Shipping method details',
          },
          404: {
            description: 'Shipping method not found',
          },
        },
      },
      put: {
        summary: 'Update a shipping method by ID',
        tags: ['Shipping'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            description: 'ID of the shipping method',
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  name: 'Standard Shipping',
                  price: 20,
                  estimatedDays: 5,
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Shipping method updated',
          },
        },
      },
      delete: {
        summary: 'Delete a shipping method by ID',
        tags: ['Shipping'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            description: 'ID of the shipping method',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Shipping method deleted',
          },
        },
      },
    },
  },
};

module.exports = shippingSwagger;
