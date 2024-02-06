import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/index.js";

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(HttpError(400, `Invalid search id: ${contactId}`));
  }
  next();
};

export const isValidIdbyKey = key => {
  return (req, res, next) => {
    const { [key]: id } = req.params;
    if (!isValidObjectId(id)) {
      next(HttpError(400, `Invalid search id: ${id}`));
    }
    next();
  };
};

export default isValidId;
