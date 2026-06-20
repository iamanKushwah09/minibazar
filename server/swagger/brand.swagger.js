const brandSwagger = {
  tags: [
    {
      name: 'Brand',
      description: 'API for managing brands',
    },
  ],
  paths: {
    '/api/brand': {
      post: {
        tags: ['Brand'],
        summary: 'Create a new brand',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  logoUrl: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Brand created successfully',
          },
        },
      },
      get: {
        tags: ['Brand'],
        summary: 'Get all brands',
        responses: {
          200: {
            description: 'A list of brands',
          },
        },
      },
    },

    '/api/brand/active': {
      get: {
        tags: ['Brand'],
        summary: 'Get all active brands',
        responses: {
          200: {
            description: 'A list of active brands',
          },
        },
      },
    },

    '/api/brand/{id}': {
      get: {
        tags: ['Brand'],
        summary: 'Get a brand by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Brand ID',
          },
        ],
        responses: {
          200: {
            description: 'Brand data',
          },
        },
      },
      put: {
        tags: ['Brand'],
        summary: 'Update a brand by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Brand ID',
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
                  logoUrl: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Brand updated',
          },
        },
      },
      delete: {
        tags: ['Brand'],
        summary: 'Delete a brand by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Brand ID',
          },
        ],
        responses: {
          200: {
            description: 'Brand deleted',
          },
        },
      },
    },
  },
};

module.exports = brandSwagger;
