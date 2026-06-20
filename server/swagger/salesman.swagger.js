const salesmanSwagger = {
  tags: [
    {
      name: 'Salesman',
      description: 'API for managing salesmen',
    },
  ],
  paths: {
    '/api/salesman/refresh': {
      get: {
        summary: 'Get busy refresh salesman data',
        tags: ['Salesman'],
        responses: {
          200: { description: 'Successfully retrieved refresh data' },
        },
      },
    },
    '/api/salesman': {
      post: {
        summary: 'Create a new salesman',
        tags: ['Salesman'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string' },
                },
                example: {
                  name: 'John Doe',
                  phone: '9876543210',
                  email: 'john@example.com',
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Salesman created successfully' },
          400: { description: 'Bad request' },
        },
      },
      get: {
        summary: 'Get all salesmen with pagination and search',
        tags: ['Salesman'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination (default: 1)',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page (default: 10, max: 100)',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
          },
          {
            name: 'q',
            in: 'query',
            description: 'Search query to filter salesmen by name, description, code, or app_code',
            required: false,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: { 
            description: 'List of salesmen with pagination info',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    salesmans: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          _id: { type: 'string' },
                          name: { type: 'string' },
                          description: { type: 'string' },
                          code: { type: 'number' },
                          app_code: { type: 'number' },
                          is_active: { type: 'boolean' },
                          created_date: { type: 'string', format: 'date-time' },
                          createdAt: { type: 'string', format: 'date-time' },
                          updatedAt: { type: 'string', format: 'date-time' }
                        }
                      }
                    },
                    totalDoc: { type: 'integer', description: 'Total number of documents' },
                    limits: { type: 'integer', description: 'Number of items per page' },
                    pages: { type: 'integer', description: 'Current page number' }
                  }
                }
              }
            }
          },
        },
      },
      delete: {
        summary: "Delete all Salesman",
        tags: ["Salesman"],
        responses: {
          200: { description: "All salesmen deleted successfully" },
          500: { description: "Internal server error" },
        },
      },
    },
    "/api/salesman/active": {
      get: {
        summary: "Get active salesmen (ID and Name only)",
        tags: ["Salesman"],
        responses: {
          200: { description: "Successfully retrieved active salesmen" },
        },
      },
    },
    '/api/salesman/{id}': {
      get: {
        summary: 'Get a salesman by ID',
        tags: ['Salesman'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Salesman ID',
          },
        ],
        responses: {
          200: { description: 'Salesman data' },
          404: { description: 'Salesman not found' },
        },
      },
      put: {
        summary: 'Update a salesman by ID',
        tags: ['Salesman'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Salesman ID',
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
                  phone: { type: 'string' },
                  email: { type: 'string' },
                },
                example: {
                  name: 'Jane Smith',
                  phone: '9123456789',
                  email: 'jane@example.com',
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Salesman updated successfully' },
          404: { description: 'Salesman not found' },
        },
      },
      delete: {
        summary: 'Delete a salesman by ID',
        tags: ['Salesman'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Salesman ID',
          },
        ],
        responses: {
          200: { description: 'Salesman deleted successfully' },
          404: { description: 'Salesman not found' },
        },
      },
    },
  },
};

module.exports = salesmanSwagger;
