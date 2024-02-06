import express from "express";

import boardsController from "../../controllers/boards-controller.js";

import { validateBody } from "../../decorators/index.js";

import { authenticate, isEmptyBody } from "../../middlewares/index.js";

import { isValidIdbyKey } from "../../middlewares/isValidId.js";

import { addBoardSchema } from "../../models/board.js";

const boardsRouter = express.Router();

boardsRouter.get("/", authenticate, boardsController.getBoards);

boardsRouter.get("/:boardId", authenticate, isValidIdbyKey("boardId"), boardsController.getBoardById);

boardsRouter.post("/", authenticate, isEmptyBody(), validateBody(addBoardSchema), boardsController.addBoard);

boardsRouter.put("/:boardId", authenticate, isValidIdbyKey("boardId"), isEmptyBody(), validateBody(addBoardSchema), boardsController.updateBoard);

boardsRouter.delete("/:boardId", authenticate, isValidIdbyKey("boardId"), boardsController.deleteBoard);

boardsRouter.patch("/filter/:boardId/:priority", authenticate, isValidIdbyKey("boardId"), isEmptyBody(), boardsController.filterBoardCards);

export default boardsRouter;