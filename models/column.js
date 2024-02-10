import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleMongooseError } from '../helpers/index.js';

const columnSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set the columns's title"],
    },
    board: { type: Schema.Types.ObjectId, ref: 'board', required: true },
  },
  { versionKey: false, timestamps: true }
);

columnSchema.post('save', handleMongooseError);

export const addColumnSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
});

const Column = model('column', columnSchema);

export default Column;
