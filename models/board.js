import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleMongooseError } from '../helpers/index.js';

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set the board's title"],
    },
    icon: { type: String, default: null },
    background: { type: String, default: null },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

boardSchema.post('save', handleMongooseError);

export const addBoardSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  icon: Joi.string(),
  background: Joi.string(),
});

export const updateBoardSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  icon: Joi.string(),
  background: Joi.string(),
});

const Board = model('board', boardSchema);

export default Board;
