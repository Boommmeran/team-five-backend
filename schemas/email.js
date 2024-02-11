import Joi from 'joi';

export const sendEmailSchema = Joi.object({
  emailForSupport: Joi.string()
    .email()
    .required()
    .messages({ 'string.required': 'missing required  field' }),
  textMessage: Joi.string()
    .min(5)
    .required()
    .messages({ 'string.required': 'missing required field' }),
});
