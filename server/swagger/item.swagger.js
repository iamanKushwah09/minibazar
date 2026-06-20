const itemSwagger = {
  tags: [
    {
      name: 'Item',
      description: 'APIs for managing items',
    },
  ],
  paths: {
    '/api/items': {
      post: {
        tags: ['Item'],
        summary: 'Create a new item',
        responses: {
          201: { description: 'Item created successfully' },
        },
      },
      get: {
        tags: ['Item'],
        summary: 'Get all items',
        responses: {
          200: { description: 'List of all items' },
        },
      },
    },
    '/api/items/show': {
      get: {
        tags: ['Item'],
        summary: 'Get show items',
        responses: {
          200: { description: 'List of show items' },
        },
      },
    },
    '/api/items/active': {
      get: {
        tags: ['Item'],
        summary: 'Get active items',
        responses: {
          200: { description: 'List of active items' },
        },
      },
    },
    '/api/items/{id}': {
      get: {
        tags: ['Item'],
        summary: 'Get an item by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Item details' },
        },
      },
      put: {
        tags: ['Item'],
        summary: 'Update an item by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Item updated' },
        },
      },
      delete: {
        tags: ['Item'],
        summary: 'Delete an item by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Item deleted' },
        },
      },
    },
  },
};

module.exports = itemSwagger;
