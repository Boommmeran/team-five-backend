import express from 'express';
import boardsController from '../../controllers/boards-controller.js';
import { validateBody } from '../../decorators/index.js';
import {
  authenticate,
  isEmptyBody,
  isValidIdbyKey,
} from '../../middlewares/index.js';

import { addBoardSchema, updateBoardSchema } from '../../models/board.js';

const boardsRouter = express.Router();

boardsRouter.get('/', authenticate, boardsController.getBoards);

boardsRouter.get(
  '/:boardId',
  authenticate,
  isValidIdbyKey('boardId'),
  boardsController.getBoardById
);

boardsRouter.post(
  '/',
  authenticate,
  isEmptyBody(),
  validateBody(addBoardSchema),
  boardsController.addBoard
);

boardsRouter.patch(
  '/:boardId',
  authenticate,
  isValidIdbyKey('boardId'),
  isEmptyBody(),
  validateBody(updateBoardSchema),
  boardsController.updateBoard
);

boardsRouter.delete(
  '/:boardId',
  authenticate,
  isValidIdbyKey('boardId'),
  boardsController.deleteBoard
);

export default boardsRouter;
