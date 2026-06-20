const offerSwagger = {
  tags: [
    {
      name: 'Offer',
      description: 'APIs for managing item offers',
    },
  ],
  paths: {
    '/api/item-offer/': {
      post: {
        tags: ['Offer'],
        summary: 'Create a new offer',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  itemId: '64fa290e58a70e3e282c649f',
                  discountPercentage: 15,
                  startDate: '2024-06-01',
                  endDate: '2024-06-30',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Offer created successfully',
          },
        },
      },
      get: {
        tags: ['Offer'],
        summary: 'Get all offers',
        responses: {
          200: {
            description: 'List of all offers',
          },
        },
      },
    },
    '/api/item-offer/{id}': {
      get: {
        tags: ['Offer'],
        summary: 'Get an offer by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Offer ID',
          },
        ],
        responses: {
          200: {
            description: 'Offer details',
          },
        },
      },
      put: {
        tags: ['Offer'],
        summary: 'Update an offer by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Offer ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  discountPercentage: 20,
                  startDate: '2024-06-05',
                  endDate: '2024-07-05',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Offer updated',
          },
        },
      },
      delete: {
        tags: ['Offer'],
        summary: 'Delete an offer by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Offer ID',
          },
        ],
        responses: {
          200: {
            description: 'Offer deleted',
          },
        },
      },
    },
  },
};

module.exports = offerSwagger;
