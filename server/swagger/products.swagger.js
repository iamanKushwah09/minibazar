const productsSwagger = {
  tags: [
    {
      name: 'Products',
      description: 'API for managing products',
    },
  ],
  paths: {
    '/api/products/add': {
      post: {
        summary: 'Add a single product',
        tags: ['Products'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  name: 'Sample Product',
                  slug: 'sample-product',
                  price: 999,
                  description: 'Product description',
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Product created' },
          400: { description: 'Invalid input' },
        },
      },
    },
    '/api/products/all': {
      post: {
        summary: 'Add multiple products',
        tags: ['Products'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  example: {
                    name: 'Product A',
                    slug: 'product-a',
                    price: 499,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Products added' },
          400: { description: 'Invalid input' },
        },
      },
    },
    '/api/products/{id}': {
      post: {
        summary: 'Get a product by ID',
        tags: ['Products'],
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
          200: { description: 'Product data' },
          404: { description: 'Product not found' },
        },
      },
      patch: {
        summary: 'Update a product by ID',
        tags: ['Products'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  name: 'Updated Product Name',
                  price: 850,
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Product updated' },
          404: { description: 'Product not found' },
        },
      },
      delete: {
        summary: 'Delete a product by ID',
        tags: ['Products'],
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
          200: { description: 'Product deleted' },
          404: { description: 'Product not found' },
        },
      },
    },
    '/api/products/product/{slug}': {
      get: {
        summary: 'Get a product by slug',
        tags: ['Products'],
        parameters: [
          {
            in: 'path',
            name: 'slug',
            required: true,
            schema: { type: 'string' },
            description: 'Product slug',
          },
        ],
        responses: {
          200: { description: 'Product data' },
          404: { description: 'Product not found' },
        },
      },
    },
    '/api/products/show': {
      get: {
        summary: 'Get all showing (enabled) products',
        tags: ['Products'],
        responses: {
          200: { description: 'List of showing products' },
        },
      },
    },
    '/api/products/store': {
      get: {
        summary: 'Get all store-visible products',
        tags: ['Products'],
        responses: {
          200: { description: 'List of store products' },
        },
      },
    },
    '/api/products': {
      get: {
        summary: 'Get all products',
        tags: ['Products'],
        responses: {
          200: { description: 'List of all products' },
        },
      },
    },
    '/api/products/update/many': {
      patch: {
        summary: 'Update multiple products',
        tags: ['Products'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  example: {
                    id: 'abc123',
                    price: 799,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Products updated' },
          400: { description: 'Invalid input' },
        },
      },
    },
    '/api/products/status/{id}': {
      put: {
        summary: 'Update the status of a product',
        tags: ['Products'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                example: {
                  status: true,
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Status updated' },
          404: { description: 'Product not found' },
        },
      },
    },
    '/api/products/delete/many': {
      patch: {
        summary: 'Delete multiple products',
        tags: ['Products'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                example: {
                  ids: ['id1', 'id2'],
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Products deleted' },
          400: { description: 'Invalid input' },
        },
      },
    },
  },
};

module.exports = productsSwagger;
