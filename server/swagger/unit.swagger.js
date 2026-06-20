const unitSwagger = {
  tags: [
    {
      name: 'Unit',
      description: 'API for managing units of measurement',
    },
  ],
  paths: {
    '/api/unit': {
      post: {
        summary: 'Create a new unit',
        tags: ['Unit'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  name: 'Kilogram',
                  symbol: 'kg',
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Unit created successfully',
          },
        },
      },
      get: {
        summary: 'Get all units',
        tags: ['Unit'],
        responses: {
          200: {
            description: 'List of all units',
          },
        },
      },
    },
    '/api/unit/active': {
      get: {
        summary: 'Get all active units',
        tags: ['Unit'],
        responses: {
          200: {
            description: 'List of active units',
          },
        },
      },
    },
    '/api/unit/{id}': {
      get: {
        summary: 'Get a unit by ID',
        tags: ['Unit'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            description: 'ID of the unit',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Unit found',
          },
          404: {
            description: 'Unit not found',
          },
        },
      },
      put: {
        summary: 'Update a unit by ID',
        tags: ['Unit'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            description: 'ID of the unit to update',
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  name: 'Gram',
                  symbol: 'g',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Unit updated successfully',
          },
        },
      },
      delete: {
        summary: 'Delete a unit by ID',
        tags: ['Unit'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            description: 'ID of the unit to delete',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Unit deleted successfully',
          },
        },
      },
    },
  },
};

module.exports = unitSwagger;
