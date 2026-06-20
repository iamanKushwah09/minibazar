const Joi = require('joi');

const validateShippingSettings = (data) => {
  const schema = Joi.object({
    shippingStrategy: Joi.string().valid('distance', 'order', 'both').required()
  });
  return schema.validate(data);
};

const validatePharmacySettings = (data) => {
  const schema = Joi.object({
    officeName: Joi.string().required(),
    officeAddress: Joi.string().required(),
    officeLatitude: Joi.number().required(),
    officeLongitude: Joi.number().required()
  });
  return schema.validate(data);
};

const validateShippingRule = (data) => {
  const schema = Joi.object({
    ruleType: Joi.string().valid('distance', 'order', 'both').required(),
    startKm: Joi.number().allow(null).optional(),
    endKm: Joi.number().allow(null).optional(),
    startOrderPrice: Joi.number().allow(null).optional(),
    endOrderPrice: Joi.number().allow(null).optional(),
    shippingCharge: Joi.number().required(),
    status: Joi.string().valid('active', 'inactive').default('active')
  });
  return schema.validate(data);
};

module.exports = {
  validateShippingSettings,
  validatePharmacySettings,
  validateShippingRule
};
