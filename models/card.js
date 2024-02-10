import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleMongooseError } from '../helpers/index.js';

const priorityList = ['without', 'low', 'medium', 'high'];

const cardSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    priority: {
      type: String,
      enum: priorityList,
      default: 'without',
    },
    deadline: { type: Date, required: true },
    column: {
      type: Schema.Types.ObjectId,
      ref: 'column',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

cardSchema.post('save', handleMongooseError);

export const addCardSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  text: Joi.string().min(0).max(300).required(),
  deadline: Joi.date().required(),
  priority: Joi.string()
    .valid(...priorityList)
    .required(),
});

export const updateCardSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  text: Joi.string().min(0).max(300),
  deadline: Joi.date(),
  priority: Joi.string().valid(...priorityList),
});

const Card = model('card', cardSchema);

export default Card;
