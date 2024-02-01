import { HttpError } from '../helpers/index.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import 'dotenv/config';

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    next(HttpError(401, 'Not authorized'));
  }
  try {
    jwt.verify(token, SECRET_KEY);

    const user = await User.findOne({ token });
    if (!user) {
      next(HttpError(401, 'Not authorized'));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401, 'Not authorized'));
  }
};

export default authenticate;
