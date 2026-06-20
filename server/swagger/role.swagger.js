const roleSwagger = {
  tags: [
    {
      name: 'Roles',
      description: 'API for managing user roles',
    },
  ],
  paths: {
    '/api/role': {
      post: {
        summary: 'Create a new role',
        tags: ['Roles'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  permissions: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
                example: {
                  name: 'admin',
                  permissions: ['create-user', 'delete-user'],
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Role created successfully' },
          400: { description: 'Invalid input' },
        },
      },
      get: {
        summary: 'Get all roles',
        tags: ['Roles'],
        responses: {
          200: { description: 'List of all roles' },
        },
      },
    },
    '/api/role/active': {
      get: {
        summary: 'Get all active roles',
        tags: ['Roles'],
        responses: {
          200: { description: 'List of active roles' },
        },
      },
    },
    '/api/role/{roleId}': {
      get: {
        summary: 'Get a role by ID',
        tags: ['Roles'],
        parameters: [
          {
            in: 'path',
            name: 'roleId',
            required: true,
            schema: { type: 'string' },
            description: 'Role ID',
          },
        ],
        responses: {
          200: { description: 'Role data' },
          404: { description: 'Role not found' },
        },
      },
      put: {
        summary: 'Update a role by ID',
        tags: ['Roles'],
        parameters: [
          {
            in: 'path',
            name: 'roleId',
            required: true,
            schema: { type: 'string' },
            description: 'Role ID',
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
                  permissions: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
                example: {
                  name: 'editor',
                  permissions: ['update-post', 'delete-comment'],
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Role updated successfully' },
          404: { description: 'Role not found' },
        },
      },
      delete: {
        summary: 'Delete a role by ID',
        tags: ['Roles'],
        parameters: [
          {
            in: 'path',
            name: 'roleId',
            required: true,
            schema: { type: 'string' },
            description: 'Role ID',
          },
        ],
        responses: {
          200: { description: 'Role deleted successfully' },
          404: { description: 'Role not found' },
        },
      },
    },
  },
};

module.exports = roleSwagger;
