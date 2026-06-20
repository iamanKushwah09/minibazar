const syncSwagger = {
  tags: [
    {
      name: 'Webhook Sync',
      description: 'APIs for external systems to push sync data via Payload',
    },
  ],
  paths: {
    '/api/sync/categories': {
      put: {
        summary: 'Sync Categories via Payload',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        Code: { type: 'string' },
                        Name: { type: 'string' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Categories synced successfully' } },
      },
    },
    '/api/sync/units': {
      put: {
        summary: 'Sync Units via Payload',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        Name: { type: 'string' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Units synced successfully' } },
      },
    },
    '/api/sync/item-groups': {
      put: {
        summary: 'Sync Item Groups via Payload',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        ParentGrpCode: { type: 'string' },
                        ParentGrpName: { type: 'string' },
                        ItemGroupCode: { type: 'string' },
                        ItemGroupName: { type: 'string' },
                        Image: { type: 'string' },
                        Alias: { type: 'string' },
                        Discount: { type: 'number' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Item Groups synced successfully' } },
      },
    },
    '/api/sync/items': {
      put: {
        summary: 'Sync Items via Payload',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        ItemCode: { type: 'string' },
                        ParentGrpCode: { type: 'string' },
                        CategoryName: { type: 'string' },
                        MainUnit: { type: 'string' },
                        ItemColour: { type: 'string' },
                        ItemColor: { type: 'string' },
                        ItemSize: { type: 'string' },
                        MainTransBal: { type: 'number' },
                        VendorPrice: { type: 'number' },
                        ItemName: { type: 'string' },
                        ItemAlias: { type: 'string' },
                        HSNCode: { type: 'string' },
                        CustomerPrice: { type: 'number' },
                        AltUnit: { type: 'string' },
                        ConFactor: { type: 'number' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Items synced successfully' } },
      },
    },
    '/api/sync/vendor-groups': {
      put: {
        summary: 'Sync Vendor Groups / Account Groups via Payload',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        ParentGrpName: { type: 'string' },
                        ParentGrpCode: { type: 'string' },
                        AppCode: { type: 'string' },
                        GroupCode: { type: 'string' },
                        GroupName: { type: 'string' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Vendor Groups synced successfully' } },
      },
    },
    '/api/sync/account-groups': {
      put: {
        summary: 'Sync Account Groups via Payload (Alias for vendor-groups)',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        ParentGrpName: { type: 'string' },
                        ParentGrpCode: { type: 'string' },
                        AppCode: { type: 'string' },
                        GroupCode: { type: 'string' },
                        GroupName: { type: 'string' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Account Groups synced successfully' } },
      },
    },
    '/api/sync/customers': {
      put: {
        summary: 'Sync Customers / Accounts via Payload',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        AccCode: { type: 'string' },
                        AccName: { type: 'string' },
                        ParentGrpCode: { type: 'string' },
                        ParentGrpName: { type: 'string' },
                        AppCode: { type: 'string' },
                        Alias: { type: 'string' },
                        PrintName: { type: 'string' },
                        Address1: { type: 'string' },
                        Address2: { type: 'string' },
                        Address3: { type: 'string' },
                        Address4: { type: 'string' },
                        GSTNo: { type: 'string' },
                        CountryName: { type: 'string' },
                        StateName: { type: 'string' },
                        CityName: { type: 'string' },
                        Email: { type: 'string' },
                        Mobile: { type: 'string' },
                        WhatsAppNo: { type: 'string' },
                        ITPAN: { type: 'string' },
                        CreditLimit: { type: 'number' },
                        SalesmanCode: { type: 'string' },
                        SalesmanName: { type: 'string' },
                        DelerType: { type: 'string' },
                        BankName: { type: 'string' },
                        IfscCode: { type: 'string' },
                        AccNo: { type: 'string' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Customers synced successfully' } },
      },
    },
    '/api/sync/accounts': {
      put: {
        summary: 'Sync Accounts via Payload (Alias for customers)',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        AccCode: { type: 'string' },
                        AccName: { type: 'string' },
                        ParentGrpCode: { type: 'string' },
                        ParentGrpName: { type: 'string' },
                        AppCode: { type: 'string' },
                        Alias: { type: 'string' },
                        PrintName: { type: 'string' },
                        Address1: { type: 'string' },
                        Address2: { type: 'string' },
                        Address3: { type: 'string' },
                        Address4: { type: 'string' },
                        GSTNo: { type: 'string' },
                        CountryName: { type: 'string' },
                        StateName: { type: 'string' },
                        CityName: { type: 'string' },
                        Email: { type: 'string' },
                        Mobile: { type: 'string' },
                        WhatsAppNo: { type: 'string' },
                        ITPAN: { type: 'string' },
                        CreditLimit: { type: 'number' },
                        SalesmanCode: { type: 'string' },
                        SalesmanName: { type: 'string' },
                        DelerType: { type: 'string' },
                        BankName: { type: 'string' },
                        IfscCode: { type: 'string' },
                        AccNo: { type: 'string' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Accounts synced successfully' } },
      },
    },
    '/api/sync/sale-types': {
      put: {
        summary: 'Sync Sale Types via Payload',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        Code: { type: 'string' },
                        Name: { type: 'string' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Sale types synced successfully' } },
      },
    },
    '/api/sync/bill-sundries': {
      put: {
        summary: 'Sync Bill Sundries via Payload',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        Code: { type: 'string' },
                        Name: { type: 'string' },
                        NatureType: { type: 'string' },
                        Discount: { type: 'number' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Bill Sundries synced successfully' } },
      },
    },
    '/api/sync/sundry-discounts': {
      put: {
        summary: 'Sync Sundry Discounts via Payload',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        BillSundryCode: { type: 'string' },
                        PartyGroupCode: { type: 'string' },
                        BillSundryName: { type: 'string' },
                        PartyGroupName: { type: 'string' },
                        SrNo: { type: 'number' },
                        Discount: { type: 'number' },
                        IsPartyGroupWise: { type: 'boolean' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Sundry Discounts synced successfully' } },
      },
    },
    '/api/sync/salesman': {
      put: {
        summary: 'Sync Salesman via Payload',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        Code: { type: 'number' },
                        Name: { type: 'string' },
                        AppCode: { type: 'number' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Salesman synced successfully' } },
      },
    },
    '/api/sync/attributes': {
      put: {
        summary: 'Sync Attribute Groups via Payload',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        Name: { type: 'string', description: 'Attribute Group Name (C1 or Name)' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Attributes synced successfully' } },
      },
    },
    '/api/sync/attribute-values': {
      put: {
        summary: 'Sync Attribute Values via Payload',
        tags: ['Webhook Sync'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        Attribute: { type: 'string', description: 'Value Name' },
                        AttributeGroup: { type: 'string', description: 'Parent Group Name' }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Attribute Values synced successfully' } },
      },
    },
  },
};

module.exports = syncSwagger;
