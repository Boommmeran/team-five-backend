import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from '../helpers/index.js';

const dateRegexp = /^\d{2}\/\d{2}\/\d{4}$/;

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set the board's title"],
    },
    icon: { type: String, required: true },
    background: {
      min: { type: String },
      desktop: { type: String },
      tablet: { type: String },
      mobile: { type: String },
    },
    filter: {
      type: String,
      enum: ["default", "without", "low", "medium", "high"],
      default: "default",
    },
    columns: [
      {
        title: { type: String, required: true },
        owner: {
          type: Schema.Types.ObjectId,
        },
        cards: [
          {
            title: { type: String, required: true },
            text: { type: String, required: true },
            priority: {
              type: String,
              enum: ["without", "low", "medium", "high"],
              default: "without",
            },
            deadline: { type: String, required: true },
            owner: {
              type: Schema.Types.ObjectId,
              required: true,
            },
          },
        ],
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

boardSchema.post("save", handleMongooseError);

export const addBoardSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  icon: Joi.string().required(),
  background: Joi.object({
    min: Joi.string().required(),
    desktop: Joi.string().required(),
    tablet: Joi.string().required(),
    mobile: Joi.string().required(),
  }),
});

export const addColumnSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
});

export const addCardSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  text: Joi.string().min(3).max(300).required(),
  deadline: Joi.string().pattern(dateRegexp).required(),
  owner: Joi.string().required(),
  priority: Joi.string().required(),
});

const Board = model("board", boardSchema);

export default Board;
