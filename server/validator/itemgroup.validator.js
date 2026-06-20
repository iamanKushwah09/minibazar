const Joi = require('joi');
const idPattern = /^[0-9a-fA-F]{24}$/; // Regex for MongoDB ObjectId

const itemGrupIdValidationSchema = Joi.object({
    id: Joi.string()
      .pattern(idPattern)
      .required()
      .messages({
        'string.pattern.base': 'ID must be a valid 24-character hexadecimal string.',
        'any.required': 'ID is required.',
      }),
  }).unknown(true);
  
  // Middleware for validating the `id` field
  const validateItemId = (req, res, next) => {
    const { error } = itemGrupIdValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };


const itemGroupValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'any.required': 'Name is required.',
    }),
  discount: Joi.number()
    .optional()
    .allow(null)
    .min(0)
    .messages({
      'number.base': 'Discount must be a number.',
      'number.min': 'Discount cannot be less than 0.',
    }),
  image: Joi.array().items(
    Joi.object({
      base64File: Joi.string().allow(null, ''),
      fileName: Joi.string().allow(null, '')
    })
  ).optional(),
  is_primary: Joi.boolean()
    .optional()
    .allow(null)
    .messages({
      'boolean.base': 'Is_primary must be a boolean value.',
    }),
  is_active: Joi.alternatives()
    .try(Joi.boolean(), Joi.number().valid(0, 1))
    .required()
    .messages({
      'alternatives.types': 'Is_active must be either a boolean or a number (0 or 1).',
      'any.required': 'Is_active is required.',
    }),
  is_parent_group: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'Is_parent_group must be a boolean value.',
      'any.required': 'Is_parent_group is required.',
    }),
  parent_id: Joi.string()
    .pattern(idPattern)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Parent_id must be a valid 24-character hexadecimal string.',
    }),
}).unknown(true);

const validateItemGroup = (req, res, next) => {
  const { error } = itemGroupValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};

module.exports = { validateItemId , validateItemGroup };
