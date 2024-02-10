import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import Column from '../models/column.js';

const getColumns = async (req, res) => {
  const { boardId: board } = req.params;

  const result = await Column.find({ board }, '-createdAt -updatedAt -board');

  res.json(result);
};

const addColumn = async (req, res) => {
  const { boardId: board } = req.params;
  const { title } = req.body;

  const result = await Column.create({ title: title.trim(), board });

  res.status(201).json(result);
};

const updateColumn = async (req, res) => {
  const { columnId } = req.params;
  const { title } = req.body;
  const column = await Column.findById(columnId);

  if (!column) {
    throw HttpError(404, 'The column was not found');
  }

  const updatedColumn = await Column.findByIdAndUpdate(
    columnId,
    { title: title.trim() },
    { new: true, select: '-createdAt -updatedAt -board' }
  );

  res.json(updatedColumn);
};

const deleteColumn = async (req, res) => {
  const { columnId } = req.params;

  const result = await Column.findByIdAndDelete(columnId);

  if (!result) {
    throw HttpError(404, 'The column was not found');
  }

  res.status(200).json(result);
};

export default {
  getColumns: ctrlWrapper(getColumns),
  addColumn: ctrlWrapper(addColumn),
  updateColumn: ctrlWrapper(updateColumn),
  deleteColumn: ctrlWrapper(deleteColumn),
};
