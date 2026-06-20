const locationSwagger = {
  tags: [
    {
      name: 'Location',
      description: 'APIs for location data like countries, states, and cities',
    },
  ],
  paths: {
    '/api/location/countries': {
      get: {
        tags: ['Location'],
        summary: 'Get all countries',
        responses: {
          200: {
            description: 'List of countries',
          },
        },
      },
    },
    '/api/location/states/{id}': {
      get: {
        tags: ['Location'],
        summary: 'Get states by country ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Country ID',
          },
        ],
        responses: {
          200: {
            description: 'List of states for the given country',
          },
        },
      },
    },
    '/api/location/cities/{country_id}/{state_id}': {
      get: {
        tags: ['Location'],
        summary: 'Get cities by country ID and state ID',
        parameters: [
          {
            in: 'path',
            name: 'country_id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Country ID',
          },
          {
            in: 'path',
            name: 'state_id',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'State ID',
          },
        ],
        responses: {
          200: {
            description: 'List of cities for the given country and state',
          },
        },
      },
    },
  },
};

module.exports = locationSwagger;
