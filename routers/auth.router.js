import {
  verifyToken,
  checkDuplicateUsernameOrEmail,
} from '../middleware/auth.middleware.js';
import controller from '../controllers/auth.controller.js';
import express from 'express';
const router = express.Router();

export default function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  router.post(
    '/signup',
    [verifyToken, checkDuplicateUsernameOrEmail],
    controller.signup,
  );

  router.post('/signin', controller.signin);

  app.use('/auth', router);
}
