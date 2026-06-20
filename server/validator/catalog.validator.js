const Joi = require('joi');

const catalogValidationSchema = Joi.object({
  catalog_name: Joi.string().required().messages({
    'string.base': 'Catalog name must be a string.',
    'string.empty': 'Catalog name is required.', // Covers empty string case
    'any.required': 'Catalog name is required.', // Covers missing value
  }),
  description: Joi.string().required().messages({
    'string.base': 'Description must be a string.',
    'string.empty': 'Description is required.', // Covers empty string case
    'any.required': 'Description is required.', // Covers missing value
  }),
  item: Joi.array().items(Joi.object()).required().messages({
    'array.base': 'Item must be an array.',
    'any.required': 'Item is required.',
  }),
  is_active: Joi.alternatives()
    .try(Joi.boolean(), Joi.number().valid(0, 1))
    .required()
    .messages({
      'alternatives.types': 'Is_active must be either a boolean or a number (0 or 1).',
      'any.required': 'Is_active is required.',
    })
});

const validateCatalog = (req, res, next) => {
  const { error } = catalogValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};


const idPattern = /^[0-9a-fA-F]{24}$/;
const catalogIdValidationSchema = Joi.object({
  id: Joi.string()
    .pattern(idPattern)
    .required()
    .messages({
      'string.pattern.base': 'ID must be a valid 24-character hexadecimal string.',
      'any.required': 'ID is required.',
    }),
});

// Middleware for validating the `id` field
const validateCatalogId = (req, res, next) => {
  const { error } = catalogIdValidationSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validateCatalog  , validateCatalogId};
