const axios = require('axios');

const getDrivingDistance = async (origin, destination) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key is missing.');
    }

    // Google Routes API endpoint
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    const requestBody = {
      origin: {
        location: {
          latLng: {
            latitude: origin.latitude,
            longitude: origin.longitude
          }
        }
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.latitude,
            longitude: destination.longitude
          }
        }
      },
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE'
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration'
    };

    const response = await axios.post(url, requestBody, { headers });
    
    if (response.data && response.data.routes && response.data.routes.length > 0) {
      const distanceMeters = response.data.routes[0].distanceMeters;
      return distanceMeters / 1000; // Return in KM
    }
    
    throw new Error('No route found between origin and destination.');
  } catch (error) {
    console.error('Error fetching Google Maps distance:', error.response?.data || error.message);
    throw new Error('Failed to calculate distance. Please verify the addresses or try again later.');
  }
};

module.exports = {
  getDrivingDistance
};
