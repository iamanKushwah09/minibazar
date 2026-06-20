const { get } = require("mongoose");

const dispatchLogSwagger = {
  tags: [
    {
      name: "DispatchLog",
      description: "APIs for managing dispatch logs",
    },
  ],
  paths: {
    "/api/dispatchlog": {
      post: {
        tags: ["DispatchLog"],
        summary: "Create a new dispatch log",
        responses: {
          201: { description: "dispatch log created" },
        },
      },
      get: {
        tags: ["DispatchLog"],
        summary: "Get all dispatch logs",
        responses: {
          200: { description: "List of dispatch logs" },
        },
      },
    },
    '/api/dispatchlog/{id}': {
      get: {
        tags: ['DispatchLog'],
        summary: 'Get a dispatch log by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'dispatch log found' },
        },
      },
      put: {
        tags: ['DispatchLog'],
        summary: 'Update a dispatch log by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'dispatch log updated' },
        },
      },
      delete: {
        tags: ['DispatchLog'],
        summary: 'Delete a dispatch log by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'dispatch log deleted' },
        },
      },
    },
  },
};

module.exports = dispatchLogSwagger;
