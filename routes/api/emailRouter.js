import express from 'express';
// import { authenticate, isEmptyBody } from '../../middlewares/index.js';
import emailControler from '../../controllers/email-controller.js';
import { validateBody } from '../../decorators/index.js';
import { sendEmailSchema } from '../../schemas/email.js';

const emailRouter = express.Router();

emailRouter.post(
  '/',
  //   authenticate,
  //   isEmptyBody,
  validateBody(sendEmailSchema),
  emailControler.sendEmailToSupport
);

export default emailRouter;
