const vendorSalesmanSwagger = {
  tags: [
    {
      name: 'Vendor Salesman',
      description: 'API for vendor-salesman associations',
    },
  ],
  paths: {
    '/api/vendor-salesman/report': {
      get: {
        summary: 'Get vendor-salesman association report',
        tags: ['Vendor Salesman'],
        responses: { 200: { description: 'Success' } },
      },
    },
  },
};

module.exports = vendorSalesmanSwagger;
