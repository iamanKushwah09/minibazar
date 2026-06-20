const Joi = require('joi');

const salesmanValidationSchema = Joi.object({
    name: Joi.string().required().messages({
          'string.base': 'Name must be a string.',
          'string.empty': 'Name is required.',
          'any.required': 'Name is required.',
        }),
    description: Joi.string().allow('').optional().messages({
        'string.base': 'Description must be a string.',
      }),
    is_active: Joi.alternatives().try(
        Joi.boolean(),
        Joi.number().valid(0, 1)
    ).optional().default(true),
});


const validateSalesman = (req, res, next)=>{
    const { error } = salesmanValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = {validateSalesman};