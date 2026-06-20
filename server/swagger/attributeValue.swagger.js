const attributeValueSwagger = {
  tags: [
    {
      name: 'AttributeValue',
      description: 'API for managing attribute values',
    },
  ],
  paths: {
    '/api/attribute-value': {
      post: {
        tags: ['AttributeValue'],
        summary: 'Create a new attribute value',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  value: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Attribute value created',
          },
        },
      },
      get: {
        tags: ['AttributeValue'],
        summary: 'Get all attribute values',
        responses: {
          200: {
            description: 'A list of attribute values',
          },
        },
      },
    },

    '/api/attribute-value/group': {
      get: {
        tags: ['AttributeValue'],
        summary: 'Get attribute values by value',
        parameters: [
          {
            in: 'query',
            name: 'value',
            required: false,
            schema: {
              type: 'string',
            },
            description: 'Filter by attribute value',
          },
        ],
        responses: {
          200: {
            description: 'Filtered attribute values',
          },
        },
      },
    },

    '/api/attribute-value/{id}': {
      get: {
        tags: ['AttributeValue'],
        summary: 'Get an attribute value by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Attribute Value ID',
          },
        ],
        responses: {
          200: {
            description: 'Attribute value data',
          },
        },
      },
      put: {
        tags: ['AttributeValue'],
        summary: 'Update an attribute value by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Attribute Value ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  value: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Attribute value updated',
          },
        },
      },
      delete: {
        tags: ['AttributeValue'],
        summary: 'Delete an attribute value by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Attribute Value ID',
          },
        ],
        responses: {
          200: {
            description: 'Attribute value deleted',
          },
        },
      },
    },
  },
};

module.exports = attributeValueSwagger;
