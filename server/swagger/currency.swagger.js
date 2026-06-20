const currencySwagger = {
  tags: [
    {
      name: 'Currency',
      description: 'API for managing currencies',
    },
  ],
  paths: {
    '/api/currency/add': {
      post: {
        tags: ['Currency'],
        summary: 'Add a new currency',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  name: { type: 'string' },
                  symbol: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Currency added' },
        },
      },
    },

    '/api/currency/add/all': {
      post: {
        tags: ['Currency'],
        summary: 'Add multiple currencies',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    name: { type: 'string' },
                    symbol: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Currencies added' },
        },
      },
    },

    '/api/currency/show': {
      get: {
        tags: ['Currency'],
        summary: 'Get only enabled/showing currencies',
        responses: {
          200: { description: 'List of showing currencies' },
        },
      },
    },

    '/api/currency': {
      get: {
        tags: ['Currency'],
        summary: 'Get all currencies',
        responses: {
          200: { description: 'List of all currencies' },
        },
      },
    },

    '/api/currency/{id}': {
      get: {
        tags: ['Currency'],
        summary: 'Get a currency by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Currency ID',
          },
        ],
        responses: {
          200: { description: 'Currency details' },
        },
      },
      put: {
        tags: ['Currency'],
        summary: 'Update a currency by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Currency ID',
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
                  symbol: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Currency updated' },
        },
      },
      delete: {
        tags: ['Currency'],
        summary: 'Delete a currency by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Currency ID',
          },
        ],
        responses: {
          200: { description: 'Currency deleted' },
        },
      },
    },

    '/api/currency/update/many': {
      patch: {
        tags: ['Currency'],
        summary: 'Update multiple currencies',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    symbol: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Currencies updated' },
        },
      },
    },

    '/api/currency/delete/many': {
      patch: {
        tags: ['Currency'],
        summary: 'Delete multiple currencies',
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
          200: { description: 'Currencies deleted' },
        },
      },
    },

    '/api/currency/status/enabled/{id}': {
      put: {
        tags: ['Currency'],
        summary: 'Enable or disable a currency',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Currency ID',
          },
        ],
        responses: {
          200: { description: 'Currency status updated' },
        },
      },
    },

    '/api/currency/status/live-exchange-rates/{id}': {
      put: {
        tags: ['Currency'],
        summary: 'Toggle live exchange rate status of a currency',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Currency ID',
          },
        ],
        responses: {
          200: { description: 'Live exchange rate status updated' },
        },
      },
    },
  },
};

module.exports = currencySwagger;
