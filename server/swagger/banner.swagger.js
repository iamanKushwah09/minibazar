const bannerSwagger = {
  tags: [
    {
      name: 'Banner',
      description: 'API for managing banners',
    },
  ],
  paths: {
    '/api/banner': {
      post: {
        tags: ['Banner'],
        summary: 'Create a new banner',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  imageUrl: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Banner created successfully',
          },
        },
      },
      get: {
        tags: ['Banner'],
        summary: 'Get all banners',
        responses: {
          200: {
            description: 'A list of banners',
          },
        },
      },
    },

    '/api/banner/{id}': {
      get: {
        tags: ['Banner'],
        summary: 'Get a banner by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Banner ID',
          },
        ],
        responses: {
          200: {
            description: 'Banner data',
          },
        },
      },
      put: {
        tags: ['Banner'],
        summary: 'Update a banner by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Banner ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  imageUrl: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Banner updated',
          },
        },
      },
      delete: {
        tags: ['Banner'],
        summary: 'Delete a banner by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Banner ID',
          },
        ],
        responses: {
          200: {
            description: 'Banner deleted',
          },
        },
      },
    },
  },
};

module.exports = bannerSwagger;
