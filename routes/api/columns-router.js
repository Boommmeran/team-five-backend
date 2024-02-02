import express from "express";

import columnsController from "../../controllers/columns-controller.js";

import { validateBody } from "../../decorators/index.js";

import { authenticate, isEmptyBody, isValidId } from "../../middlewares/index.js";

import { addColumnSchema } from "../../models/board.js";

const columnsRouter = express.Router();

columnsRouter.get("/:boardId", authenticate, isValidId, columnsController.getColumns);

columnsRouter.post("/:boardId", authenticate, isValidId, isEmptyBody, validateBody(addColumnSchema), columnsController.addColumnInBoard);

columnsRouter.put("/", authenticate, isEmptyBody, columnsController.updateColumn);

columnsRouter.delete("/", authenticate, columnsController.deleteColumn);

export default columnsRouter;