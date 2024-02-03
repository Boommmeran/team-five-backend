import Joi from 'joi';

export const sendEmailSchema = Joi.object({
  emailForSupport: Joi.string()
    .email()
    .required()
    .messages({ 'string.required': 'missing required email field' }),
  textMessage: Joi.string()
    .min(10)
    .required()
    .messages({ 'string.required': 'missing required field' }),
});
