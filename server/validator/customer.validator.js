const Joi = require('joi');

const idPattern = /^[0-9a-fA-F]{24}$/; // Regex for MongoDB ObjectId
const customerValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'any.required': 'Name is required.',
    }),
  code: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Code must be a string.',
    }),
  alias: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Alias must be a string.',
    }),
  print_name: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Print name must be a string.',
    }),
  address: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Address must be a string.',
    }),
  password: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Password must be a string.',
    }),  
  shipping_address: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Shipping address must be a string.',
    }),
  country_id: Joi.string()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Country ID must be a valid ObjectId.',
    }),
  state_id: Joi.string()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'State ID must be a valid ObjectId.',
    }),
  city_id: Joi.string()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'City ID must be a valid ObjectId.',
    }),
  group_type: Joi.string()
    .valid('Customer', 'Vendor')
    .required()
    .messages({
      'any.only': 'Group type must be either "Customer" or "Vendor".',
      'any.required': 'Group type is required.',
    }),
  application_type: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Application type must be a string.',
    }),
  pincode: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Pincode must be a string.',
    }),
  gst_no: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'GST number must be a string.',
    }),
  aadhaar_no: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Aadhaar number must be a string.',
    }),
  email: Joi.string()
    .email()
    .allow(null, '')
    .messages({
      'string.email': 'Email must be a valid email address.',
    }),
  mobile: Joi.string()
    .allow(null, '')
    .pattern(/^[0-9]+$/)
    .messages({
      'string.pattern.base': 'Mobile must contain only numeric characters.',
    }),
  tel_no: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Telephone number must be a string.',
    }),
  contact_person: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Contact person must be a string.',
    }),
  bank_detail: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Bank detail must be a string.',
    }),
  discount: Joi.number()
    .allow(null)
    .min(0)
    .messages({
      'number.base': 'Discount must be a number.',
      'number.min': 'Discount cannot be less than 0.',
    }),
  dealer_type: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Dealer type must be a string.',
    }),
  gst_type: Joi.string()
    .valid(
      'Registered',
      'Un-Registered',
      'Composition',
      'Govt. Body',
      'UIN Holder'
    )
    .required()
    .messages({
      'any.only': 'GST type must be one of "Registered", "Un-Registered", "Composition", "Govt. Body", or "UIN Holder".',
      'any.required': 'GST type is required.',
    }),
  vendor_group_id: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Vendor group ID must be a string.',
    }),
  salesman_id: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Salesman ID must be a string.',
    }),
  is_credit_limit: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'Is_credit_limit must be a boolean.',
      'any.required': 'Is_credit_limit is required.',
    }),
  amount: Joi.number()
    .allow(null)
    .min(0)
    .messages({
      'number.base': 'Amount must be a number.',
      'number.min': 'Amount cannot be less than 0.',
    }),
  days: Joi.number()
    .allow(null)
    .min(0)
    .messages({
      'number.base': 'Days must be a number.',
      'number.min': 'Days cannot be less than 0.',
    }),
    
    // .messages({
    //   'alternatives.types': 'Is_active must be either a boolean or a number (0 or 1).',
    //   'any.required': 'Is_active is required.',
    // })
});

const validateCustomer = (req, res, next) => {
  const { error } = customerValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};


const CustomerIdValidationSchema = Joi.object({
    id: Joi.string()
      .pattern(idPattern)
      .required()
      .messages({
        'string.pattern.base': 'ID must be a valid 24-character hexadecimal string.',
        'any.required': 'ID is required.',
      }),
  });
  
  // Middleware for validating the `id` field
  const validateCustomerId = (req, res, next) => {
    const { error } = CustomerIdValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
  

module.exports = { validateCustomerId , validateCustomer };
