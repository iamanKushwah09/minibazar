const shippingService = require('../../services/shipping.service');

const calculateShipping = async (req, res) => {
  try {
    const { latitude, longitude, orderAmount } = req.body;
    
    if (!latitude || !longitude || orderAmount === undefined) {
      return res.status(400).json({ success: false, message: 'Latitude, longitude, and orderAmount are required.' });
    }

    const result = await shippingService.calculateShipping(latitude, longitude, orderAmount);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  calculateShipping
};
