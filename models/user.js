import { Schema, model } from 'mongoose';
import { handleMongooseError } from '../helpers/index.js';
import Joi from 'joi';

const user = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

user.post('save', handleMongooseError);

export const userRegisterScheme = Joi.object({
  name: Joi.string()
    .required()
    .messages({ 'string.required': 'missing required name field' }),
  email: Joi.string()
    .email()
    .required()
    .messages({ 'string.required': 'missing required email field' }),
  password: Joi.string()
    .required()
    .pattern(
      /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/,
      'only latin letters, numbers and symbols'
    )
    .min(8)
    .max(64)
    .messages({
      'string.required': 'missing required password field',
      'string.min': '8 chars minimum',
      'string.max': '64 chars maximum',
      'string.disallow': 'no spaces',
      'string.pattern': 'only latin letters, numbers and symbols',
    }),
});

export const userLoginScheme = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({ 'string.required': 'missing required email field' }),
  password: Joi.string().required().messages({
    'string.required': 'missing required password field',
  }),
});

export const profileUpdateScheme = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
});

export const User = model('user', user);
