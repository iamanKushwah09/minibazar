const dispatchSwagger = {
  tags: [
    {
      name: 'Dispatch',
      description: 'APIs for managing dispatches',
    },
  ],
  paths: {
    '/api/dispatch': {
      post: {
        tags: ['Dispatch'],
        summary: 'Create a new dispatch',
        responses: {
          201: { description: 'Dispatch created' },
        },
      },
      get: {
        tags: ['Dispatch'],
        summary: 'Get all dispatches',
        responses: {
          200: { description: 'List of dispatches' },
        },
      },
    },
    '/api/dispatch/{id}': {
      get: {
        tags: ['Dispatch'],
        summary: 'Get a dispatch by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Dispatch found' },
        },
      },
      put: {
        tags: ['Dispatch'],
        summary: 'Update a dispatch by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Dispatch updated' },
        },
      },
      delete: {
        tags: ['Dispatch'],
        summary: 'Delete a dispatch by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Dispatch deleted' },
        },
      },
    },
    '/api/dispatch/items/{order_id}': {
      get: {
        tags: ['Dispatch'],
        summary: 'Get dispatch items for a specific order',
        parameters: [
          {
            in: 'path',
            name: 'order_id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Dispatch items found' },
        },
      },
    },
  },
};

module.exports = dispatchSwagger;
