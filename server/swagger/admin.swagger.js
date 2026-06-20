const adminSwagger = {
  tags: [
    {
      name: 'Admin',
      description: 'Admin and Staff Management APIs',
    },
  ],
  paths: {
    '/api/admin/register': {
      post: {
        summary: 'Register an admin',
        tags: ['Admin'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Admin registered successfully',
          },
        },
      },
    },

    '/api/admin/login': {
      post: {
        summary: 'Login an admin',
        tags: ['Admin'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
          },
        },
      },
    },

    '/api/admin/forget-password': {
      put: {
        summary: 'Request password reset',
        tags: ['Admin'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Reset link sent',
          },
        },
      },
    },

    '/api/admin/reset-password': {
      put: {
        summary: 'Reset admin password',
        tags: ['Admin'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'newPassword'],
                properties: {
                  token: { type: 'string' },
                  newPassword: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Password updated successfully',
          },
        },
      },
    },

    '/api/admin/add': {
      post: {
        summary: 'Add a new staff member',
        tags: ['Admin'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'role'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Staff added successfully',
          },
        },
      },
    },

    '/api/admin': {
      get: {
        summary: 'Get all staff members',
        tags: ['Admin'],
        responses: {
          200: {
            description: 'List of all staff',
          },
        },
      },
    },

    '/api/admin/{id}': {
      post: {
        summary: 'Get a staff member by ID',
        tags: ['Admin'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Staff ID',
          },
        ],
        responses: {
          200: {
            description: 'Staff details',
          },
        },
      },

      put: {
        summary: 'Update a staff member',
        tags: ['Admin'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Staff ID',
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
                  email: { type: 'string' },
                  role: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Staff updated successfully',
          },
        },
      },

      delete: {
        summary: 'Delete a staff member',
        tags: ['Admin'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Staff ID',
          },
        ],
        responses: {
          200: {
            description: 'Staff deleted successfully',
          },
        },
      },
    },

    '/api/admin/update-status/{id}': {
      put: {
        summary: 'Update staff status',
        tags: ['Admin'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Staff ID',
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
                  status: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Staff status updated',
          },
        },
      },
    },
  },
};

module.exports = adminSwagger;
