const languageSwagger = {
  tags: [
    {
      name: 'Language',
      description: 'APIs for managing languages',
    },
  ],
  paths: {
    '/api/language/add': {
      post: {
        tags: ['Language'],
        summary: 'Add a new language',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  code: { type: 'string' },
                  isEnabled: { type: 'boolean' },
                },
                required: ['name', 'code'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Language added successfully' },
        },
      },
    },
    '/api/language/add/all': {
      post: {
        tags: ['Language'],
        summary: 'Add multiple languages',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    code: { type: 'string' },
                    isEnabled: { type: 'boolean' },
                  },
                  required: ['name', 'code'],
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Languages added successfully' },
        },
      },
    },
    '/api/language/update/many': {
      patch: {
        tags: ['Language'],
        summary: 'Update multiple languages',
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
                    code: { type: 'string' },
                    isEnabled: { type: 'boolean' },
                  },
                  required: ['id'],
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Languages updated' },
        },
      },
    },
    '/api/language/delete/many': {
      patch: {
        tags: ['Language'],
        summary: 'Delete multiple languages',
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
                required: ['ids'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Languages deleted' },
        },
      },
    },
    '/api/language/{id}': {
      get: {
        tags: ['Language'],
        summary: 'Get language by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Language details' },
        },
      },
      put: {
        tags: ['Language'],
        summary: 'Update language by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  code: { type: 'string' },
                  isEnabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Language updated' },
        },
      },
      patch: {
        tags: ['Language'],
        summary: 'Delete a language by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Language deleted' },
        },
      },
    },
    '/api/language/show': {
      get: {
        tags: ['Language'],
        summary: 'Get all enabled/showing languages',
        responses: {
          200: { description: 'List of showing languages' },
        },
      },
    },
    '/api/language/all': {
      get: {
        tags: ['Language'],
        summary: 'Get all languages',
        responses: {
          200: { description: 'List of all languages' },
        },
      },
    },
    '/api/language/status/{id}': {
      put: {
        tags: ['Language'],
        summary: 'Enable/Disable a language',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  isEnabled: { type: 'boolean' },
                },
                required: ['isEnabled'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Language status updated' },
        },
      },
    },
  },
};

module.exports = languageSwagger;
