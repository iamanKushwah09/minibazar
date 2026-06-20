const extendedCategorySwagger = {
  tags: [
    {
      name: 'Categories',
      description: 'API for managing categories',
    },
  ],
  paths: {
    '/api/categories/add': {
      post: {
        tags: ['Categories'],
        summary: 'Add a single category',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Category added successfully' },
        },
      },
    },

    '/api/categories/add/all': {
      post: {
        tags: ['Categories'],
        summary: 'Add multiple categories',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Categories added successfully' },
        },
      },
    },

    '/api/categories/show': {
      get: {
        tags: ['Categories'],
        summary: 'Get all visible (showing) categories',
        responses: {
          200: { description: 'List of showing categories' },
        },
      },
    },

    '/api/categories': {
      get: {
        tags: ['Category'],
        summary: 'Get all categories (default)',
        responses: {
          200: { description: 'List of categories' },
        },
      },
    },

    '/api/categories/all': {
      get: {
        tags: ['Categories'],
        summary: 'Get all categories (extended)',
        responses: {
          200: { description: 'Full list of categories' },
        },
      },
    },

    '/api/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Get a category by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID',
          },
        ],
        responses: {
          200: { description: 'Category found' },
        },
      },
      put: {
        tags: ['Categories'],
        summary: 'Update a category by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID',
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
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Category updated' },
        },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete a category by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID',
          },
        ],
        responses: {
          200: { description: 'Category deleted' },
        },
      },
    },

    '/api/categories/status/{id}': {
      put: {
        tags: ['Categories'],
        summary: 'Toggle category visibility (show/hide)',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID',
          },
        ],
        responses: {
          200: { description: 'Category status updated' },
        },
      },
    },

    '/api/categories/delete/many': {
      patch: {
        tags: ['Categories'],
        summary: 'Delete multiple categories',
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
          200: { description: 'Categories deleted' },
        },
      },
    },

    '/api/categories/update/many': {
      patch: {
        tags: ['Categories'],
        summary: 'Update multiple categories',
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
                        name: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Categories updated' },
        },
      },
    },
  },
};

module.exports = extendedCategorySwagger;
