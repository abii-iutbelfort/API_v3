import {
  verifyToken,
  checkDuplicateUsernameOrEmail,
} from '../middleware/auth.middleware.js';
import controller from '../controllers/transactions.controller.js';
import express from 'express';
const router = express.Router();

export default (app) => {

  router.get('/', controller.findAll);

  router.get('/client/:userId', [verifyToken], controller.findByClient);

  router.delete('/:transactionId', [verifyToken], controller.revert);

  router.post('/products/', [verifyToken], controller.sellProducts);

  router.post("/membership/", [verifyToken], controller.sellMembership);

  router.post("/top_up/", [verifyToken], controller.topUp);

  app.use('/transactions', router);
};
