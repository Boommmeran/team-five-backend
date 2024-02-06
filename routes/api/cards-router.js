import express from "express";

import cardsController from "../../controllers/cards-controller.js";

import { validateBody } from "../../decorators/index.js";

import { authenticate, isEmptyBody } from "../../middlewares/index.js";

import { isValidIdbyKey } from "../../middlewares/isValidId.js";

import { addCardSchema } from "../../models/board.js";

const cardsRouter = express.Router();

cardsRouter.post("/:boardId", authenticate, isValidIdbyKey("boardId"), isEmptyBody(), validateBody(addCardSchema), cardsController.addCard);

cardsRouter.put("/:boardId", authenticate, isValidIdbyKey("boardId"), isEmptyBody(), cardsController.updateCard);

cardsRouter.patch("/:boardId", authenticate, isValidIdbyKey("boardId"), isEmptyBody(), cardsController.replaceCard);

cardsRouter.delete("/:boardId", authenticate, isValidIdbyKey("boardId"), cardsController.deleteCard);

export default cardsRouter;