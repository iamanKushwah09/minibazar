const itemDiscountSwagger = {
  tags: [
    {
      name: 'Item Discount',
      description: 'API for item-specific discounts',
    },
  ],
  paths: {
    '/api/item-discount': {
      get: {
        summary: 'Get item according discount',
        tags: ['Item Discount'],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/api/item-discount/get': {
      post: {
        summary: 'Get item according discount (POST)',
        tags: ['Item Discount'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ItemCode: { type: 'string' },
                  PartyCode: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Success' } },
      },
    },
    '/api/item-discount/{ItemCode}/{PartyCode}': {
      get: {
        summary: 'Get item discount from database',
        tags: ['Item Discount'],
        parameters: [
          { in: 'path', name: 'ItemCode', required: true, schema: { type: 'string' } },
          { in: 'path', name: 'PartyCode', required: true, schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Success' } },
      },
    },
  },
};

module.exports = itemDiscountSwagger;
