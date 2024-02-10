import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import Card from '../models/card.js';
import { isValidObjectId } from 'mongoose';

const getCards = async (req, res) => {
  const { boardId } = req.params;
  const cards = await Card.find({}, '-createdAt -updatedAt').populate({
    path: 'column',
    match: { board: boardId },
    select: '-createdAt -updatedAt -board',
  });
  const filteredCards = cards.filter(card => card.column);
  res.json(filteredCards);
};

const addCard = async (req, res) => {
  const { columnId: column } = req.params;
  const { title } = req.body;
  const result = await Card.create({
    ...req.body,
    title: title.trim(),
    column,
  });
  res.status(201).json(result);
};

const updateCard = async (req, res) => {
  const { cardId } = req.params;
  const card = await Card.findById(cardId);

  if (!card) {
    throw HttpError(404, 'The card was not found');
  }

  const title = req.body.title?.trim() || card.title;
  const result = await Card.findByIdAndUpdate(
    cardId,
    { ...req.body, title },
    { new: true, select: '-createdAt -updatedAt' }
  ).populate({
    path: 'column',
    select: '-createdAt -updatedAt -board',
  });

  res.json(result);
};

const moveCard = async (req, res) => {
  const { cardId } = req.params;
  const { column } = req.body;

  if (!isValidObjectId(column)) {
    throw HttpError(400, `Invalid column id: ${column}`);
  }

  const result = await Card.findByIdAndUpdate(
    cardId,
    { column },
    { new: true, select: '-createdAt -updatedAt' }
  ).populate({
    path: 'column',
    select: '-createdAt -updatedAt -board',
  });

  if (!result) {
    throw HttpError(404, 'The card was not found');
  }

  res.json(result);
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;

  const result = await Card.findByIdAndDelete(cardId, {
    new: true,
    select: '-createdAt -updatedAt',
  }).populate({
    path: 'column',
    select: '-createdAt -updatedAt -board',
  });

  if (!result) {
    throw HttpError(404, 'The card was not found');
  }

  res.json(result);
};

export default {
  getCards: ctrlWrapper(getCards),
  addCard: ctrlWrapper(addCard),
  updateCard: ctrlWrapper(updateCard),
  moveCard: ctrlWrapper(moveCard),
  deleteCard: ctrlWrapper(deleteCard),
};
