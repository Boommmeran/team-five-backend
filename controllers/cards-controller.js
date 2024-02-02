import mongoose from 'mongoose';
import Board from "../models/board.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const addCard = async (req, res) => {
  const { _id } = req.user;
  const { boardId } = req.params;
  const { owner } = req.body;

  const newObjectId = new mongoose.Types.ObjectId();

  const { columns } = await Board.findOne({
    _id: boardId,
    owner: _id,
  });

  if (!columns) {
    throw HttpError(404, "Not found");
  }

  const column = columns.find((column) => column.id === owner);

  if (!column) {
    throw HttpError(400, `${owner} is not valid id`);
  }

  await Board.updateOne(
    { _id: boardId, "columns._id": column._id },
    {
      $push: {
        "columns.$.cards": { _id: newObjectId, owner, ...req.body },
      },
    }
  );

  const boardGetCard = await Board.findOne({ _id: boardId, ovner: _id });
  const result = boardGetCard.columns
    .find((column) => column.id === owner)
    .cards.find((card) => card._id.toString() === newObjectId.toString());

  res.status(201).json(result);
};

const updateCard = async (req, res) => {
  const { _id: userId } = req.user;
  const { boardId } = req.params;
  const { _id, owner, title, text, priority, deadline } = req.body;

  if (!boardId) {
    throw HttpError(400, `${boardId} is not valid id`);
  }

  const { columns } = await Board.findOne({
    _id: boardId,
    owner: userId,
  });

  if (!columns) {
    throw HttpError(404, "Not found");
  }

  const column = columns.find((column) => column.id === owner);
  const columnIndex = columns.findIndex((column) => column.id === owner);

  if (!column) {
    throw HttpError(400, `${owner} is not valid id`);
  }

  const index = column.cards.findIndex((card) => card.id === _id);

  const oldData = columns[columnIndex].cards[index];

  const newData = {
    title: title ?? oldData.title,
    text: text ?? oldData.text,
    priority: priority ?? oldData.priority,
    deadline: deadline ?? oldData.deadline,
    owner: oldData.owner,
    _id: oldData._id,
  };

  await Board.updateOne(
    { _id: boardId },
    {
      $set: {
        [`columns.${columnIndex}.cards.${index}`]: newData,
      },
    }
  );

  const boardGetColumn = await Board.findOne({ _id: boardId });

  res.json(boardGetColumn.columns[columnIndex].cards[index]);
};

const replaceCard = async (req, res) => {
  const { _id } = req.user;
  const { boardId } = req.params;
  const { _id: cardId, owner, newOwner } = req.body;

  if (!boardId) {
    throw HttpError(400, `${boardId} is not valid id`);
  }

  const { columns } = await Board.findOne({
    _id: boardId,
    owner: _id,
  });

  if (!columns) {
    throw HttpError(404, "Not found");
  }

  const oldColumn = columns.find((column) => column.id === owner);

  if (!oldColumn) {
    throw HttpError(400, `${owner} is not valid id`);
  }

  const columnIndex = columns.findIndex((column) => column.id === owner);
  const cardIndex = oldColumn.cards.findIndex(
    (oldCard) => oldCard.id === cardId
  );

  columns[columnIndex].cards[cardIndex].owner = newOwner;

  const newCard = columns[columnIndex].cards[cardIndex];
  
  await Board.updateOne(
    { _id: boardId, "columns._id": oldColumn._id },
    {
      $pull: {
        "columns.$.cards": { _id: cardId },
      },
    }
  );

  const newColumn = columns.find((column) => column.id === newOwner);

  if (!newColumn) {
    throw HttpError(400, `${newOwner} is not valid id`);
  }

  
  await Board.updateOne(
    { _id: boardId, "columns._id": newColumn.id },
    {
      $push: {
        "columns.$.cards": newCard,
      },
    }
  );

  res.json(newCard);
};

const deleteCard = async (req, res) => {
  const { _id } = req.user;
  const { boardId } = req.params;
  const { _id: cardId, owner } = req.body;

  const { columns } = await Board.findOne({
    _id: boardId,
    owner: _id,
  });

  if (!columns) {
    throw HttpError(404, "Not found");
  }

  const column = columns.find((column) => column.id === owner);

  if (!column) {
    throw HttpError(400, `${owner} is not valid id`);
  }

  await Board.updateOne(
    { _id: boardId, "columns._id": column._id },
    {
      $pull: {
        "columns.$.cards": { _id: cardId },
      },
    }
  );

  res.status(200).json({
    message: "Card deleted saccessfully",
  });
};

export default {
    addCard: ctrlWrapper(addCard),
    updateCard: ctrlWrapper(updateCard),
    replaceCard: ctrlWrapper(replaceCard),
    deleteCard: ctrlWrapper(deleteCard),
}