const categorySwagger = {
  tags: [
    {
      name: 'Category',
      description: 'API for managing categories',
    },
  ],
  paths: {
    '/api/category': {
      post: {
        tags: ['Category'],
        summary: 'Create a new category',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Category created' },
        },
      },
      get: {
        tags: ['Category'],
        summary: 'Get all categories',
        responses: {
          200: { description: 'A list of categories' },
        },
      },
    },

    '/api/category/active': {
      get: {
        tags: ['Category'],
        summary: 'Get active categories',
        responses: {
          200: { description: 'Active categories fetched' },
        },
      },
    },

    '/api/category/{id}': {
      get: {
        tags: ['Category'],
        summary: 'Get category by ID',
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
          200: { description: 'Category data' },
        },
      },
      put: {
        tags: ['Category'],
        summary: 'Update category by ID',
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
                  description: { type: 'string' },
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
        tags: ['Category'],
        summary: 'Delete category by ID',
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

    '/api/category/stru': {
      get: {
        tags: ['Category'],
        summary: 'Get structured categories',
        responses: {
          200: { description: 'Structured category list fetched' },
        },
      },
    },
  },
};

module.exports = categorySwagger;
