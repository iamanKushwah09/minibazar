const itemGroupSwagger = {
  tags: [
    {
      name: 'ItemGroup',
      description: 'APIs for managing item groups',
    },
  ],
  paths: {
    '/api/item-groups': {
      post: {
        tags: ['ItemGroup'],
        summary: 'Create a new item group',
        responses: {
          201: { description: 'Item group created successfully' },
        },
      },
      get: {
        tags: ['ItemGroup'],
        summary: 'Get all item groups',
        responses: {
          200: { description: 'List of item groups' },
        },
      },
    },
    '/api/item-groups/active': {
      get: {
        tags: ['ItemGroup'],
        summary: 'Get all active item groups',
        responses: {
          200: { description: 'List of active item groups' },
        },
      },
    },
    '/api/item-groups/{id}': {
      get: {
        tags: ['ItemGroup'],
        summary: 'Get item group by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Item group details' },
        },
      },
      put: {
        tags: ['ItemGroup'],
        summary: 'Update item group by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Item group updated' },
        },
      },
      delete: {
        tags: ['ItemGroup'],
        summary: 'Delete item group by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Item group deleted' },
        },
      },
    },
  },
};

module.exports = itemGroupSwagger;
