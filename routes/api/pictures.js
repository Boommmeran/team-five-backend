import express from 'express';
import { authenticate, isEmptyBody } from '../../middlewares/index.js';
import pictureContoller from '../../controllers/picture-contoller.js';
import upload from '../../middlewares/upload.js';

const picturesRouter = express.Router();

picturesRouter.post(
  '/',
  upload.single('picture'),
  pictureContoller.uploadPicture
);

export default picturesRouter;
