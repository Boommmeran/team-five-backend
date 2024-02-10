import Board from '../models/board.js';
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

const getBoards = async (req, res) => {
  const { _id: owner } = req.user;

  const results = await Board.find({ owner }, '-createdAt -updatedAt -owner');

  res.json(results);
};

const getBoardById = async (req, res) => {
  const { boardId } = req.params;

  const result = await Board.findById(boardId, '-createdAt -updatedAt -owner');

  if (!result) {
    throw HttpError(404, `${boardId} was not found`);
  }

  res.json(result);
};

const addBoard = async (req, res) => {
  const { _id: owner } = req.user;
  const { title } = req.body;

  const trimedTitle = title.trim();

  const result = await Board.create({
    ...req.body,
    title: trimedTitle,
    owner,
  });

  res.status(201).json(result);
};

const updateBoard = async (req, res) => {
  const { boardId } = req.params;
  const board = await Board.findById(boardId);

  if (!board) {
    throw HttpError(404, 'The board was not found');
  }

  const title = req.body.title?.trim() || board.title;
  const result = await Board.findByIdAndUpdate(
    boardId,
    { ...req.body, title },
    { new: true, select: '-createdAt -updatedAt -owner' }
  );

  res.json(result);
};

const deleteBoard = async (req, res) => {
  const { boardId } = req.params;

  const result = await Board.findByIdAndDelete(boardId);

  if (!result) {
    throw HttpError(404, 'The board was not found');
  }
  res.json(result);
};

export default {
  getBoards: ctrlWrapper(getBoards),
  getBoardById: ctrlWrapper(getBoardById),
  addBoard: ctrlWrapper(addBoard),
  updateBoard: ctrlWrapper(updateBoard),
  deleteBoard: ctrlWrapper(deleteBoard),
};
