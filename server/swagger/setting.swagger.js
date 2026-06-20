const settingsSwagger = {
  tags: [
    {
      name: 'Settings',
      description: 'Global and Store Settings APIs',
    },
  ],
  paths: {
    '/api/setting/global/add': {
      post: {
        summary: 'Add a new global setting',
        tags: ['Settings'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  siteName: 'My Store',
                  maintenanceMode: false,
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Global setting added successfully' },
        },
      },
    },
    '/api/setting/global/all': {
      get: {
        summary: 'Get all global settings',
        tags: ['Settings'],
        responses: {
          200: { description: 'List of global settings' },
        },
      },
    },
    '/api/setting/global/update': {
      put: {
        summary: 'Update global settings',
        tags: ['Settings'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  maintenanceMode: true,
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Global setting updated' },
        },
      },
    },
    '/api/setting/store-setting/add': {
      post: {
        summary: 'Add a new store setting',
        tags: ['Settings'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  currency: 'INR',
                  timezone: 'Asia/Kolkata',
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Store setting added' },
        },
      },
    },
    '/api/setting/store-setting/all': {
      get: {
        summary: 'Get all store settings',
        tags: ['Settings'],
        responses: {
          200: { description: 'List of store settings' },
        },
      },
    },
    '/api/setting/store-setting/seo': {
      get: {
        summary: 'Get SEO store settings',
        tags: ['Settings'],
        responses: {
          200: { description: 'SEO settings for store' },
        },
      },
    },
    '/api/setting/store-setting/update': {
      put: {
        summary: 'Update store settings',
        tags: ['Settings'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  currency: 'USD',
                  timezone: 'America/New_York',
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Store setting updated' },
        },
      },
    },
    '/api/setting/store/customization/add': {
      post: {
        summary: 'Add store customization setting',
        tags: ['Settings'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  themeColor: '#FF5733',
                  logoUrl: 'https://example.com/logo.png',
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Store customization setting added' },
        },
      },
    },
    '/api/setting/store/customization/all': {
      get: {
        summary: 'Get store customization settings',
        tags: ['Settings'],
        responses: {
          200: { description: 'Store customization data' },
        },
      },
    },
    '/api/setting/store/customization/update': {
      put: {
        summary: 'Update store customization setting',
        tags: ['Settings'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  themeColor: '#00BFFF',
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Store customization updated' },
        },
      },
    },
  },
};

module.exports = settingsSwagger;
