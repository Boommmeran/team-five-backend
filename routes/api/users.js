import express from 'express';
import validateBody from '../../decorators/validateBody.js';
import {
  authenticate,
  isEmptyBody,
} from '../../middlewares/index.js';
import {
  userLoginScheme,
  userRegisterScheme,
  userUpdateScheme,
  updateThemeScheme,
} from '../../models/user.js';
import usersController from '../../controllers/users-conroller.js';
import upload from '../../middlewares/upload.js';

const usersRouter = express.Router();

usersRouter.post(
  '/register',
  isEmptyBody(),
  validateBody(userRegisterScheme),
  usersController.register
);

usersRouter.post(
  '/login',
  isEmptyBody(),
  validateBody(userLoginScheme),
  usersController.login
);

usersRouter.get('/current', authenticate, usersController.current);

usersRouter.post('/logout', authenticate, usersController.logout);

usersRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  usersController.updateAvatar
);

usersRouter.patch(
  '/update',
  authenticate,
  isEmptyBody(),
  validateBody(userUpdateScheme),
  usersController.updateProfile
);

usersRouter.patch(
  '/theme',
  authenticate,
  isEmptyBody(),
  validateBody(updateThemeScheme),
  usersController.updateTheme
);

export default usersRouter;
