import Board from "../models/board.js";
import { HttpError, filter } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getBoards = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Board.find({ owner }, "-createdAt -updatedAt");

  const shortBoards = result.map((board) => {
    return {
      title: board.title,
      _id: board._id,
      icon: board.icon,
      owner: board.owner,
    };
  });

  res.json(shortBoards);
};

const getBoardById = async (req, res) => {
  const { _id } = req.user;
  const { boardId } = req.params;

  const result = await Board.findOne({ _id: boardId, owner: _id });

  if (!result) {
    throw HttpError(400, `${boardId} is not valid id`);
  }

  let filteredCards = null;

  if (result.filter !== "default") {
    filteredCards = filter(result.columns, result.filter);
  }

  res.json({ ...result._doc, columns: filteredCards ?? result.columns });
};

const addBoard = async (req, res) => {
  const { _id: owner } = req.user;
  const { title, background } = req.body;

  const trimedTitle = title.trim();

  const board = await Board.findOne({ title: trimedTitle, owner });

  if (board) {
    throw HttpError(409, "The board whith such title already exist.");
  }

  const result = await Board.create({
    ...req.body,
    owner,
    background,
  });

  res.status(201).json(result);
};

const filterBoardCards = async (req, res) => {
  const { _id } = req.user;
  const { boardId, priority } = req.params;

  const result = await Board.findOneAndUpdate(
    { _id: boardId, owner: _id },
    {
      filter: priority,
    },
    { new: true }
  );

  if (!result) {
    throw HttpError(400, `${boardId} is not valid id`);
  }

  const filteredCards = filter(result.columns, priority);

  res.json({ ...result._doc, columns: filteredCards });
};

const updateBoard = async (req, res) => {
  const { _id } = req.user;
  const { boardId } = req.params;
  const { title, background } = req.body;

  let trimedTitle = null;

  if (title) {
    trimedTitle = title.trim();
  }

  const backgroundCheck = background ? { background } : {};

  const board = await Board.findOne({
    title: trimedTitle,
    owner: _id,
    ...backgroundCheck,
  });

  if (board) {
    throw HttpError(409, "The board whith such title already exist.");
  }
  const result = await Board.findOneAndUpdate(
    {
      _id: boardId,
      owner: _id,
    },
    req.body,
    { new: true, select: "-createdAt -updatedAt -columns" }
  );

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

const deleteBoard = async (req, res) => {
  const { _id: owner } = req.user;
  const { boardId: _id } = req.params;

  const result = await Board.findOneAndRemove({
    _id,
    owner
  });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({
    message: "Board has been deleted successful",
  });
};

export default {
    getBoards: ctrlWrapper(getBoards),
    getBoardById: ctrlWrapper(getBoardById),
    addBoard: ctrlWrapper(addBoard),
    filterBoardCards: ctrlWrapper(filterBoardCards),
    updateBoard: ctrlWrapper(updateBoard),
    deleteBoard: ctrlWrapper(deleteBoard),
}