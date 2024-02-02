import express from "express";

import cardsController from "../../controllers/cards-controller.js";

import { validateBody } from "../../decorators/index.js";

import { authenticate, isEmptyBody, isValidId } from "../../middlewares/index.js";

import { addCardSchema } from "../../models/board.js";

const cardsRouter = express.Router();

cardsRouter.post("/:boardId", authenticate, isValidId, isEmptyBody, validateBody(addCardSchema), cardsController.addCard);

cardsRouter.put("/:boardId", authenticate, isValidId, isEmptyBody, cardsController.updateCard);

cardsRouter.patch("/:boardId", authenticate, isValidId, isEmptyBody, cardsController.replaceCard);

cardsRouter.delete("/:boardId", authenticate, isValidId, cardsController.deleteCard);

export default cardsRouter;