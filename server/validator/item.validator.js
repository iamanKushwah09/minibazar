const Joi = require('joi');

const idPattern = /^[0-9a-fA-F]{24}$/; // Regex for MongoDB ObjectId
const itemValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'any.required': 'Name is required.',
    }),
  alias: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Alias must be a string.',
    }),
  print_name: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Print name must be a string.',
    }),
  category_id: Joi.string()
    .pattern(idPattern)
    .optional()
    .allow(null)
    .messages({
      'string.pattern.base': 'Category ID must be a valid 24-character hexadecimal string.',
    }),
  item_group_id: Joi.string()
    .pattern(idPattern)
    .optional()
    .allow(null)
    .messages({
      'string.pattern.base': 'Item Group ID must be a valid 24-character hexadecimal string.',
    }),
  brand_id: Joi.string()
    .pattern(idPattern)
    .optional()
    .allow(null)
    .messages({
      'string.pattern.base': 'Brand ID must be a valid 24-character hexadecimal string.',
    }),
  unit_id: Joi.string()
    .pattern(idPattern)
    .optional()
    .allow(null)
    .messages({
      'string.pattern.base': 'Unit ID must be a valid 24-character hexadecimal string.',
    }),
  alternate_unit: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Alternate unit must be a string.',
    }),
  conversion_factor: Joi.number()
    .optional()
    .allow(null)
    .messages({
      'number.base': 'Conversion factor must be a number.',
    }),
  tax_gst: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Tax GST must be a string.',
    }),
  hsn_code: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'HSN code must be a string.',
    }),
  sale_price: Joi.number()
    .optional()
    .allow(null)
    .messages({
      'number.base': 'Sale price must be a number.',
    }),
  mrp: Joi.number()
    .optional()
    .allow(null)
    .messages({
      'number.base': 'MRP must be a number.',
    }),
  discount: Joi.number()
    .optional()
    .allow(null)
    .min(0)
    .messages({
      'number.base': 'Discount must be a number.',
      'number.min': 'Discount cannot be less than 0.',
    }),
  vendor_discount: Joi.number()
    .optional()
    .allow(null)
    .min(0)
    .messages({
      'number.base': 'Vendor discount must be a number.',
      'number.min': 'Vendor discount cannot be less than 0.',
    }),
  short_description: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Short description must be a string.',
    }),
  long_description: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Long description must be a string.',
    }),
  specification: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Specification must be a string.',
    }),
  image: Joi.array()
    .items(Joi.object())
    .optional()
    .allow(null)
    .messages({
      'array.base': 'Image must be an array of objects.',
    }),
  default_image: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Default image must be a string.',
    }),
  application_type: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Application type must be a string.',
    }),
    is_active: Joi.alternatives()
    .try(Joi.boolean(), Joi.number().valid(0, 1))
    .required()
    .messages({
      'alternatives.types': 'Is_active must be either a boolean or a number (0 or 1).',
      'any.required': 'Is_active is required.',
    }),
});

const validateItem = (req, res, next) => {
  const { error } = itemValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};

const itemIdValidationSchema = Joi.object({
  id: Joi.string()
    .pattern(idPattern)
    .required()
    .messages({
      'string.pattern.base': 'ID must be a valid 24-character hexadecimal string.',
      'any.required': 'ID is required.',
    }),
});

// Middleware for validating the `id` field
const validateItemId = (req, res, next) => {
  const { error } = itemIdValidationSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validateItem  , validateItemId};
