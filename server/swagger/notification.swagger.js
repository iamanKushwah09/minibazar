const notificationSwagger = {
  tags: [
    {
      name: 'Notification',
      description: 'APIs for managing notifications',
    },
  ],
  paths: {
    '/api/notification/add': {
      post: {
        tags: ['Notification'],
        summary: 'Add a new notification',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  title: 'Low stock',
                  message: 'The stock of item ABC is below threshold.',
                  type: 'stock',
                  productId: '64fa290e58a70e3e282c649f',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Notification added successfully',
          },
        },
      },
    },
    '/api/notification/': {
      get: {
        tags: ['Notification'],
        summary: 'Get all notifications',
        responses: {
          200: {
            description: 'List of notifications',
          },
        },
      },
    },
    '/api/notification/{id}': {
      put: {
        tags: ['Notification'],
        summary: 'Update notification status by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Notification ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  status: 'read',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Notification status updated',
          },
        },
      },
      delete: {
        tags: ['Notification'],
        summary: 'Delete a notification by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Notification ID',
          },
        ],
        responses: {
          200: {
            description: 'Notification deleted',
          },
        },
      },
    },
    '/api/notification/product-id/{id}': {
      delete: {
        tags: ['Notification'],
        summary: 'Delete notification by product ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
          },
        ],
        responses: {
          200: {
            description: 'Notification(s) deleted by product ID',
          },
        },
      },
    },
    '/api/notification/update/many': {
      patch: {
        tags: ['Notification'],
        summary: 'Update status of multiple notifications',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  ids: ['64fa290e58a70e3e282c649f', '64fa290e58a70e3e282c649e'],
                  status: 'read',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Notifications updated',
          },
        },
      },
    },
    '/api/notification/delete/many': {
      patch: {
        tags: ['Notification'],
        summary: 'Delete multiple notifications',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  ids: ['64fa290e58a70e3e282c649f', '64fa290e58a70e3e282c649e'],
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Notifications deleted',
          },
        },
      },
    },
  },
};

module.exports = notificationSwagger;
