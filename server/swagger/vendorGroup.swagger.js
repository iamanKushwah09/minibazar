const vendorGroupSwagger = {
  tags: [
    {
      name: 'VendorGroup',
      description: 'API for managing vendor groups',
    },
  ],
  paths: {
    '/api/vendor-group/refresh': {
      get: {
        summary: 'Refresh and get vendor group data',
        tags: ['VendorGroup'],
        responses: {
          200: {
            description: 'Refreshed data retrieved successfully',
          },
        },
      },
    },
    '/api/vendor-group': {
      post: {
        summary: 'Create a new vendor group',
        tags: ['VendorGroup'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  title: 'Supplier Group A',
                  parentId: '64c84f...',
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Vendor group created successfully',
          },
        },
      },
      get: {
        summary: 'Get all vendor groups',
        tags: ['VendorGroup'],
        responses: {
          200: {
            description: 'List of vendor groups',
          },
        },
      },
    },
    '/api/vendor-group/active': {
      get: {
        summary: 'Get all active vendor groups',
        tags: ['VendorGroup'],
        responses: {
          200: {
            description: 'List of active vendor groups',
          },
        },
      },
    },
    '/api/vendor-group/{id}': {
      get: {
        summary: 'Get a vendor group by ID',
        tags: ['VendorGroup'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            description: 'ID of the vendor group',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Vendor group found',
          },
          404: {
            description: 'Vendor group not found',
          },
        },
      },
      put: {
        summary: 'Update a vendor group by ID',
        tags: ['VendorGroup'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            description: 'ID of the vendor group to update',
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
                  title: 'Updated Group Title',
                  parentId: '64c84f...',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Vendor group updated successfully',
          },
        },
      },
      delete: {
        summary: 'Delete a vendor group by ID',
        tags: ['VendorGroup'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            description: 'ID of the vendor group to delete',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Vendor group deleted successfully',
          },
        },
      },
    },
  },
};

module.exports = vendorGroupSwagger;
