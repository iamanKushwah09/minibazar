const storeCustomerSwagger = {
  tags: [
    {
      name: 'StoreCustomer',
      description: 'Customer authentication, profile, and address APIs',
    },
  ],
  paths: {
    '/api/store/customer/verify-email': {
      post: {
        tags: ['StoreCustomer'],
        summary: 'Send email verification code',
        responses: {
          200: { description: 'Verification code sent' },
        },
      },
    },
    '/api/store/customer/shipping/address/{id}': {
      post: {
        tags: ['StoreCustomer'],
        summary: 'Add shipping address for a customer',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          201: { description: 'Address added' },
        },
      },
      get: {
        tags: ['StoreCustomer'],
        summary: 'Get all shipping addresses for a customer',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'List of addresses' },
        },
      },
    },
    '/api/store/customer/shipping/address/{userId}/{shippingId}': {
      put: {
        tags: ['StoreCustomer'],
        summary: 'Update a shipping address',
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
          },
          {
            in: 'path',
            name: 'shippingId',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Address updated' },
        },
      },
      delete: {
        tags: ['StoreCustomer'],
        summary: 'Delete a shipping address',
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
          },
          {
            in: 'path',
            name: 'shippingId',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Address deleted' },
        },
      },
    },
    '/api/store/customer/register/{token}': {
      post: {
        tags: ['StoreCustomer'],
        summary: 'Register a customer using token',
        parameters: [
          {
            in: 'path',
            name: 'token',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          201: { description: 'Customer registered' },
        },
      },
    },
    '/api/store/customer/login': {
      post: {
        tags: ['StoreCustomer'],
        summary: 'Login a customer',
        responses: {
          200: { description: 'Login successful' },
        },
      },
    },
    '/api/store/customer/signup/oauth': {
      post: {
        tags: ['StoreCustomer'],
        summary: 'Register or login using OAuth provider (Google/Facebook)',
        responses: {
          200: { description: 'Authenticated via OAuth' },
        },
      },
    },
    '/api/store/customer/signup/{token}': {
      post: {
        tags: ['StoreCustomer'],
        summary: 'Register via provider token (Google/Facebook)',
        parameters: [
          {
            in: 'path',
            name: 'token',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          201: { description: 'Authenticated via provider' },
        },
      },
    },
    '/api/store/customer/forget-password': {
      put: {
        tags: ['StoreCustomer'],
        summary: 'Send password reset link/code',
        responses: {
          200: { description: 'Reset link sent' },
        },
      },
    },
    '/api/store/customer/reset-password': {
      put: {
        tags: ['StoreCustomer'],
        summary: 'Reset password',
        responses: {
          200: { description: 'Password reset' },
        },
      },
    },
    '/api/store/customer/change-password': {
      post: {
        tags: ['StoreCustomer'],
        summary: 'Change password',
        responses: {
          200: { description: 'Password changed' },
        },
      },
    },
    '/api/store/customer/add/all': {
      post: {
        tags: ['StoreCustomer'],
        summary: 'Add multiple customers',
        responses: {
          201: { description: 'Customers added' },
        },
      },
    },
    '/api/store/customer': {
      get: {
        tags: ['StoreCustomer'],
        summary: 'Get all customers',
        responses: {
          200: { description: 'List of customers' },
        },
      },
    },
    '/api/store/customer/{id}': {
      get: {
        tags: ['StoreCustomer'],
        summary: 'Get customer by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Customer details' },
        },
      },
      put: {
        tags: ['StoreCustomer'],
        summary: 'Update a customer by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Customer updated' },
        },
      },
      delete: {
        tags: ['StoreCustomer'],
        summary: 'Delete a customer by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Customer deleted' },
        },
      },
    },
  },
};

module.exports = storeCustomerSwagger;

