const attributeSwagger = {
  tags: [
    {
      name: 'Attributes',
      description: 'Attribute Group Management',
    },
  ],
  paths: {
    '/api/attribute-group': {
      post: {
        summary: 'Create a new attribute',
        tags: ['Attributes'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'group'],
                properties: {
                  name: { type: 'string' },
                  group: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Attribute created successfully',
          },
        },
      },
      get: {
        summary: 'Get all attributes',
        tags: ['Attributes'],
        responses: {
          200: {
            description: 'List of attributes',
          },
        },
      },
    },

    '/api/attribute-group/active': {
      get: {
        summary: 'Get active attribute groups',
        tags: ['Attributes'],
        responses: {
          200: {
            description: 'List of active attribute groups',
          },
        },
      },
    },

    '/api/attribute-group/{id}': {
      get: {
        summary: 'Get an attribute by ID',
        tags: ['Attributes'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Attribute ID',
          },
        ],
        responses: {
          200: {
            description: 'Attribute details',
          },
        },
      },

      put: {
        summary: 'Update an attribute by ID',
        tags: ['Attributes'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Attribute ID',
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
                  group: { type: 'string' },
                  status: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Attribute updated successfully',
          },
        },
      },

      delete: {
        summary: 'Delete an attribute by ID',
        tags: ['Attributes'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Attribute ID',
          },
        ],
        responses: {
          200: {
            description: 'Attribute deleted successfully',
          },
        },
      },
    },
  },
};

module.exports = attributeSwagger;
