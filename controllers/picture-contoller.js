import { uploadImage } from '../Utils/cloudinaryUpload.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import fs from 'fs/promises';

const uploadPicture = async (req, res, next) => {
  if (!req.file) {
    throw HttpError(400, 'missing file');
  }
  const { title } = req.body;

  if (!title) {
    throw HttpError(400, 'missing title');
  }

  const { path: tempUpload } = req.file; //шлях до файлу

  const pictureURL = await uploadImage(tempUpload, title, 'pictures'); // завантажуємо файл на клоудінарі
  await fs.unlink(tempUpload); // видаляємо тимчасовий оригінальний файл
  // public_url = http://res.cloudinary.com/dt7u6ic1c/image/upload/v1706799169/ + avatarURL
  res.json({ pictureURL });
};

export default {
  uploadPicture: ctrlWrapper(uploadPicture),
};
