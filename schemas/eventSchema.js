const Joi = require('joi');

const eventSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Event title is required.',
      'string.min': 'Event title must be at least 1 character long.',
      'string.max': 'Event title must be less than or equal to 200 characters long.',
    }),
  description: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Event description is required.',
      'string.min': 'Event description must be at least 1 character long.',
      'string.max': 'Event description must be less than or equal to 1000 characters long.',
    }),
  date: Joi.date()
    .greater('now')
    .required()
    .messages({
      'date.base': 'Event date must be a valid date.',
      'date.greater': 'Event date must be in the future.',
    }),
  time: Joi.string().required(),
  isOnline: Joi.boolean().required(),
  venue: Joi.string().allow('').optional(),
  link: Joi.string().uri().allow('').optional(),
  chiefGuests: Joi.object({
    name: Joi.string().allow('').optional(),
    image: Joi.any().optional(),
  }),
  donation: Joi.string().allow('').optional(),
  group: Joi.string().allow('').optional(),
}).required();

module.exports = eventSchema;
