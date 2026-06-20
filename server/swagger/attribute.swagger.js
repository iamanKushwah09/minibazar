const attributeSwagger = {
  tags: [
    {
      name: 'Attribute',
      description: 'Attribute and Child Attribute Management APIs',
    },
  ],
  paths: {
    '/api/attributes': {
      get: {
        tags: ['Attribute'],
        summary: 'Get all attributes',
        responses: {
          200: {
            description: 'List of attributes',
          },
        },
      },
    },

    '/api/attributes/show': {
      get: {
        tags: ['Attribute'],
        summary: 'Get showing attributes',
        responses: {
          200: {
            description: 'List of active/visible attributes',
          },
        },
      },
    },

    '/api/attributes/show/test': {
      put: {
        tags: ['Attribute'],
        summary: 'Update test showing attributes',
        responses: {
          200: {
            description: 'Attributes visibility updated for testing',
          },
        },
      },
    },

    '/api/attributes/update/many': {
      patch: {
        tags: ['Attribute'],
        summary: 'Update multiple attributes',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id'],
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    type: { type: 'string' },
                    status: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Attributes updated successfully',
          },
        },
      },
    },

    '/api/attributes/{id}': {
      get: {
        tags: ['Attribute'],
        summary: 'Get attribute by ID',
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
            description: 'Attribute found',
          },
        },
      },
      put: {
        tags: ['Attribute'],
        summary: 'Update attribute by ID',
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
                  type: { type: 'string' },
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
        tags: ['Attribute'],
        summary: 'Delete attribute by ID',
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

    '/api/attributes/status/{id}': {
      put: {
        tags: ['Attribute'],
        summary: 'Update attribute status',
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
                required: ['status'],
                properties: {
                  status: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Status updated',
          },
        },
      },
    },

    '/api/attributes/status/child/{id}': {
      put: {
        tags: ['Attribute'],
        summary: 'Update child attribute status',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Child Attribute ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Child status updated',
          },
        },
      },
    },

    '/api/attributes/child/{id}/{ids}': {
      get: {
        tags: ['Attribute'],
        summary: 'Get child attribute by attribute and child ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Attribute ID',
          },
          {
            in: 'path',
            name: 'ids',
            required: true,
            schema: { type: 'string' },
            description: 'Child Attribute ID',
          },
        ],
        responses: {
          200: {
            description: 'Child attribute found',
          },
        },
      },
    },

    '/api/attributes/update/child/{attributeId}/{childId}': {
      put: {
        tags: ['Attribute'],
        summary: 'Update child attribute',
        parameters: [
          {
            in: 'path',
            name: 'attributeId',
            required: true,
            schema: { type: 'string' },
          },
          {
            in: 'path',
            name: 'childId',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  childName: { type: 'string' },
                  childValue: { type: 'string' },
                  status: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Child attribute updated',
          },
        },
      },
    },

    '/api/attributes/update/child/many': {
      patch: {
        tags: ['Attribute'],
        summary: 'Update multiple child attributes',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['attributeId', 'childId'],
                  properties: {
                    attributeId: { type: 'string' },
                    childId: { type: 'string' },
                    childName: { type: 'string' },
                    childValue: { type: 'string' },
                    status: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Child attributes updated',
          },
        },
      },
    },

    '/api/attributes/delete/child/{attributeId}/{childId}': {
      put: {
        tags: ['Attribute'],
        summary: 'Delete child attribute',
        parameters: [
          {
            in: 'path',
            name: 'attributeId',
            required: true,
            schema: { type: 'string' },
          },
          {
            in: 'path',
            name: 'childId',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Child attribute deleted',
          },
        },
      },
    },

    '/api/attributes/delete/many': {
      patch: {
        tags: ['Attribute'],
        summary: 'Delete multiple attributes',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Attributes deleted',
          },
        },
      },
    },

    '/api/attributes/delete/child/many': {
      patch: {
        tags: ['Attribute'],
        summary: 'Delete multiple child attributes',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['attributeId', 'childId'],
                  properties: {
                    attributeId: { type: 'string' },
                    childId: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Child attributes deleted',
          },
        },
      },
    },
  },
};

module.exports = attributeSwagger;
