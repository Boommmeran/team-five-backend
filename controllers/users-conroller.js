import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import 'dotenv/config';
import { uploadImage } from '../Utils/cloudinaryUpload.js';
import { optimizeImage } from '../Utils/imageOptimizer.js';
import { nanoid } from 'nanoid';

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    ...req.body,
    password: hashPassword,
  });

  const payload = { id: newUser._id };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '23h',
  });
  newUser.token = token;
  await newUser.save();

  res.status(201).json({
    token,
    user: newUser,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '23h',
  });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user,
  });
};

const current = async (req, res) => {
  res.json(req.user);
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, {
    token: null,
  });
  res.status(204).json();
};

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  if (!req.file) {
    throw HttpError(400, 'missing file');
  }
  const randomName = nanoid();
  const { path: tempUpload } = req.file; //шлях до файлу
  const optimizedFilePath = `tmp/${randomName}.webp`; // новий оптимізований шлях

  const options = {
    input: tempUpload,
    output: optimizedFilePath,
  };

  await optimizeImage(options); // оптимізація
  const avatarURL = await uploadImage(optimizedFilePath, randomName, 'avatars'); // завантажуємо оптимізований файл на клоудінарі
  await fs.unlink(tempUpload); // видаляємо тимчасовий оригінальний файл
  await fs.unlink(optimizedFilePath); // видаляємо тимчасовий оптимізований файл
  await User.findByIdAndUpdate(_id, { avatarURL }); // обновляємо базу данних юзера
  res.json({ avatarURL });
};

const updateProfile = async (req, res, next) => {
  const { _id } = req.user;
  const { name, email, password } = req.body;

  if (password && password !== '') {
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(_id, { password: hashPassword });
  }

  const { name: upName, email: upEmail } = await User.findByIdAndUpdate(
    _id,
    { name, email },
    { new: true }
  );
  res.json({ name: upName, email: upEmail });
};

const updateTheme = async (req, res, next) => {
  const { _id } = req.user;
  const { theme } = req.body;
  const updateUser = await User.findByIdAndUpdate(
    _id,
    { theme },
    {
      new: true,
    }
  );
  res.json(updateUser);
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  updateProfile: ctrlWrapper(updateProfile),
  updateTheme: ctrlWrapper(updateTheme),
};
