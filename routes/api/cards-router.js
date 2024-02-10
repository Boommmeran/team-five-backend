import express from 'express';
import cardsController from '../../controllers/cards-controller.js';
import { validateBody } from '../../decorators/index.js';
import {
  authenticate,
  isEmptyBody,
  isValidIdbyKey,
} from '../../middlewares/index.js';
import { addCardSchema, updateCardSchema } from '../../models/card.js';

const cardsRouter = express.Router();

cardsRouter.get(
  '/:boardId',
  authenticate,
  isValidIdbyKey('boardId'),
  cardsController.getCards
);

cardsRouter.post(
  '/:columnId',
  authenticate,
  isValidIdbyKey('columnId'),
  isEmptyBody(),
  validateBody(addCardSchema),
  cardsController.addCard
);

cardsRouter.patch(
  '/:cardId',
  authenticate,
  isValidIdbyKey('cardId'),
  isEmptyBody(),
  validateBody(updateCardSchema),
  cardsController.updateCard
);

cardsRouter.patch(
  '/:cardId/move',
  authenticate,
  isValidIdbyKey('cardId'),
  isEmptyBody(),
  cardsController.moveCard
);

cardsRouter.delete(
  '/:cardId',
  authenticate,
  isValidIdbyKey('cardId'),
  cardsController.deleteCard
);

export default cardsRouter;
