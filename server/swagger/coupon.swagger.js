const couponSwagger = {
  tags: [
    {
      name: 'Coupon',
      description: 'API for managing coupons',
    },
  ],
  paths: {
    '/api/coupon/add': {
      post: {
        tags: ['Coupon'],
        summary: 'Add a single coupon',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  discount: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Coupon added successfully' },
        },
      },
    },

    '/api/coupon/add/all': {
      post: {
        tags: ['Coupon'],
        summary: 'Add multiple coupons',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    discount: { type: 'number' },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Coupons added successfully' },
        },
      },
    },

    '/api/coupon': {
      get: {
        tags: ['Coupon'],
        summary: 'Get all coupons',
        responses: {
          200: { description: 'List of all coupons' },
        },
      },
    },

    '/api/coupon/show': {
      get: {
        tags: ['Coupon'],
        summary: 'Get only enabled (showing) coupons',
        responses: {
          200: { description: 'List of showing coupons' },
        },
      },
    },

    '/api/coupon/{id}': {
      get: {
        tags: ['Coupon'],
        summary: 'Get a coupon by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Coupon ID',
          },
        ],
        responses: {
          200: { description: 'Coupon details' },
        },
      },
      put: {
        tags: ['Coupon'],
        summary: 'Update a coupon by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Coupon ID',
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
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Coupon updated' },
        },
      },
      delete: {
        tags: ['Coupon'],
        summary: 'Delete a coupon by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Coupon ID',
          },
        ],
        responses: {
          200: { description: 'Coupon deleted' },
        },
      },
    },

    '/api/coupon/status/{id}': {
      put: {
        tags: ['Coupon'],
        summary: 'Toggle coupon status (enable/disable)',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Coupon ID',
          },
        ],
        responses: {
          200: { description: 'Coupon status updated' },
        },
      },
    },

    '/api/coupon/update/many': {
      patch: {
        tags: ['Coupon'],
        summary: 'Update multiple coupons',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  updates: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        code: { type: 'string' },
                        discount: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Coupons updated' },
        },
      },
    },

    '/api/coupon/delete/many': {
      patch: {
        tags: ['Coupon'],
        summary: 'Delete multiple coupons',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ids: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Coupons deleted' },
        },
      },
    },
  },
};

module.exports = couponSwagger;
