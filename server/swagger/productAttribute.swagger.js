const productAttributesSwagger = {
  tags: [
    {
      name: 'ProductAttributes',
      description: 'API for managing product attributes',
    },
  ],
  paths: {
    '/api/product-attribute/product-attributes': {
      post: {
        summary: 'Create a new product attribute',
        tags: ['ProductAttributes'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  name: 'Color',
                  values: ['Red', 'Blue', 'Green'],
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Product attribute created successfully',
          },
          400: {
            description: 'Invalid input',
          },
        },
      },
      get: {
        summary: 'Get all product attributes',
        tags: ['ProductAttributes'],
        responses: {
          200: {
            description: 'List of product attributes',
          },
        },
      },
    },
    '/api/product-attribute/product-attributes/{id}': {
      get: {
        summary: 'Get a product attribute by ID',
        tags: ['ProductAttributes'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Product attribute ID',
          },
        ],
        responses: {
          200: {
            description: 'Product attribute data',
          },
          404: {
            description: 'Attribute not found',
          },
        },
      },
      put: {
        summary: 'Update a product attribute by ID',
        tags: ['ProductAttributes'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Product attribute ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  name: 'Size',
                  values: ['S', 'M', 'L'],
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Product attribute updated',
          },
          400: {
            description: 'Invalid input',
          },
          404: {
            description: 'Attribute not found',
          },
        },
      },
      delete: {
        summary: 'Delete a product attribute by ID',
        tags: ['ProductAttributes'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Product attribute ID',
          },
        ],
        responses: {
          200: {
            description: 'Product attribute deleted',
          },
          404: {
            description: 'Attribute not found',
          },
        },
      },
    },
  },
};

module.exports = productAttributesSwagger;
