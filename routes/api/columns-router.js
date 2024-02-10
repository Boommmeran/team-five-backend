import express from 'express';
import columnsController from '../../controllers/columns-controller.js';
import { validateBody } from '../../decorators/index.js';
import {
  authenticate,
  isEmptyBody,
  isValidIdbyKey,
} from '../../middlewares/index.js';
import { addColumnSchema } from '../../models/column.js';

const columnsRouter = express.Router();

columnsRouter.get(
  '/:boardId',
  authenticate,
  isValidIdbyKey('boardId'),
  columnsController.getColumns
);

columnsRouter.post(
  '/:boardId',
  authenticate,
  isValidIdbyKey('boardId'),
  isEmptyBody(),
  validateBody(addColumnSchema),
  columnsController.addColumn
);

columnsRouter.patch(
  '/:columnId',
  authenticate,
  isEmptyBody(),
  isValidIdbyKey('columnId'),
  validateBody(addColumnSchema),
  columnsController.updateColumn
);

columnsRouter.delete(
  '/:columnId',
  authenticate,
  columnsController.deleteColumn
);

export default columnsRouter;
