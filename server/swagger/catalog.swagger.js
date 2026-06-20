const catalogSwagger = {
  tags: [
    {
      name: 'Catalog',
      description: 'API for managing catalog entries',
    },
  ],
  paths: {
    '/api/catalog': {
      post: {
        tags: ['Catalog'],
        summary: 'Create a new catalog',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Catalog created',
          },
        },
      },
      get: {
        tags: ['Catalog'],
        summary: 'Get all catalog entries',
        responses: {
          200: {
            description: 'A list of catalog items',
          },
        },
      },
    },

    '/api/catalog/{id}': {
      get: {
        tags: ['Catalog'],
        summary: 'Get catalog by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Catalog ID',
          },
        ],
        responses: {
          200: {
            description: 'Catalog data',
          },
        },
      },
      put: {
        tags: ['Catalog'],
        summary: 'Update catalog by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Catalog ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Catalog updated',
          },
        },
      },
      delete: {
        tags: ['Catalog'],
        summary: 'Delete catalog by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Catalog ID',
          },
        ],
        responses: {
          200: {
            description: 'Catalog deleted',
          },
        },
      },
    },

    '/api/catalog/pdf_generator/{category_id}/{item_group_id}': {
      get: {
        tags: ['Catalog'],
        summary: 'Generate PDF catalog data',
        parameters: [
          {
            in: 'path',
            name: 'category_id',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID',
          },
          {
            in: 'path',
            name: 'item_group_id',
            required: true,
            schema: { type: 'string' },
            description: 'Item Group ID',
          },
        ],
        responses: {
          200: {
            description: 'PDF generated with catalog data',
          },
        },
      },
    },
  },
};

module.exports = catalogSwagger;
