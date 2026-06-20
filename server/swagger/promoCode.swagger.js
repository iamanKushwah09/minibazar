const promoCodeSwagger = {
  tags: [
    {
      name: 'PromoCodes',
      description: 'API for managing promo codes',
    },
  ],
  paths: {
    '/api/promo-code': {
      post: {
        summary: 'Create a new promo code',
        tags: ['PromoCodes'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['code', 'discount'],
                properties: {
                  code: { type: 'string' },
                  discount: { type: 'number' },
                  validTill: { type: 'string', format: 'date' },
                  isActive: { type: 'boolean' },
                },
                example: {
                  code: 'SAVE20',
                  discount: 20,
                  validTill: '2025-12-31',
                  isActive: true,
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Promo code created successfully' },
          400: { description: 'Invalid input' },
        },
      },
      get: {
        summary: 'Get all promo codes',
        tags: ['PromoCodes'],
        responses: {
          200: { description: 'List of all promo codes' },
        },
      },
    },
    '/api/promo-codes/{id}': {
      get: {
        summary: 'Get a promo code by ID',
        tags: ['PromoCodes'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Promo code ID',
          },
        ],
        responses: {
          200: { description: 'Promo code data' },
          404: { description: 'Promo code not found' },
        },
      },
      put: {
        summary: 'Update a promo code by ID',
        tags: ['PromoCodes'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Promo code ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  discount: { type: 'number' },
                  validTill: { type: 'string', format: 'date' },
                  isActive: { type: 'boolean' },
                },
                example: {
                  code: 'NEWYEAR50',
                  discount: 50,
                  validTill: '2026-01-01',
                  isActive: false,
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Promo code updated' },
          404: { description: 'Promo code not found' },
        },
      },
      delete: {
        summary: 'Delete a promo code by ID',
        tags: ['PromoCodes'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Promo code ID',
          },
        ],
        responses: {
          200: { description: 'Promo code deleted' },
          404: { description: 'Promo code not found' },
        },
      },
    },
  },
};

module.exports = promoCodeSwagger;
