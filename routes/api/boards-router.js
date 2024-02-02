import express from "express";

import boardsController from "../../controllers/boards-controller.js";

import { validateBody } from "../../decorators/index.js";

import { authenticate, isEmptyBody, isValidId } from "../../middlewares/index.js";

import { addBoardSchema } from "../../models/board.js";

const boardsRouter = express.Router();

boardsRouter.get("/", authenticate, boardsController.getBoards);

boardsRouter.get("/:boardId", authenticate, isValidId, boardsController.getBoardById);

boardsRouter.post("/", authenticate, isEmptyBody, validateBody(addBoardSchema), boardsController.addBoard);

boardsRouter.put("/:boardId", authenticate, isValidId, isEmptyBody, validateBody(addBoardSchema), boardsController.updateBoard);

boardsRouter.delete("/:boardId", authenticate, isValidId, boardsController.deleteBoard);

boardsRouter.patch("/filter/:boardId/:priority", authenticate, isValidId, isEmptyBody, boardsController.filterBoardCards);

export default boardsRouter;