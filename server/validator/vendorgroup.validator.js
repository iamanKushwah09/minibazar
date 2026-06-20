const Joi = require('joi');

const idPattern = /^[0-9a-fA-F]{24}$/; // Regex for MongoDB ObjectId
const vendorGroupValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'any.required': 'Name is required.',
    }),
  discount: Joi.number()
    .min(0)
    .max(100)
    .allow(null)
    .messages({
      'number.base': 'Discount must be a number.',
      'number.min': 'Discount cannot be less than 0.',
      'number.max': 'Discount cannot be greater than 100.',
      'any.allowOnly': 'Discount must be a number between 0 and 100 or null.',
    }),
  is_active: Joi.alternatives()
    .try(Joi.boolean(), Joi.number().valid(0, 1))
    .required()
    .messages({
      'alternatives.types': 'Is_active must be either a boolean or a number (0 or 1).',
      'any.required': 'Is_active is required.',
    }),
  parent_id: Joi.string()
    .optional()
    .allow(null, '')
    .pattern(idPattern)
    .messages({
      'string.pattern.base': 'Parent_id must be a valid 24-character hexadecimal string.',
    }),
}).unknown(true);

const validateVendorGroup = (req, res, next) => {
  const { error } = vendorGroupValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // Map through all errors to send detailed response
    const errors = error.details.map((err) => err.message);
    return res.status(400).json({ errors });
  }
  next();
};

const VendorGroupIdValidationSchema = Joi.object({
  id: Joi.string()
    .pattern(idPattern)
    .required()
    .messages({
      'string.pattern.base': 'ID must be a valid 24-character hexadecimal string.',
      'any.required': 'ID is required.',
    }),
});

// Middleware for validating the `id` field
const validateVendorGroupId = (req, res, next) => {
  const { error } = VendorGroupIdValidationSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};


module.exports = { validateVendorGroup , validateVendorGroupId };
