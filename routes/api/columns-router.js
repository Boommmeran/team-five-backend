import express from "express";

import columnsController from "../../controllers/columns-controller.js";

import { validateBody } from "../../decorators/index.js";

import { authenticate, isEmptyBody, isValidIdbyKey } from "../../middlewares/index.js";

import { addColumnSchema } from "../../models/board.js";

const columnsRouter = express.Router();

columnsRouter.get("/:boardId", authenticate, isValidIdbyKey("boardId"), columnsController.getColumns);

columnsRouter.post("/:boardId", authenticate, isValidIdbyKey("boardId"), isEmptyBody(), validateBody(addColumnSchema), columnsController.addColumnInBoard);

columnsRouter.put("/", authenticate, isEmptyBody(), columnsController.updateColumn);

columnsRouter.delete("/", authenticate, columnsController.deleteColumn);

export default columnsRouter;