import {
  verifyToken,
  checkDuplicateUsernameOrEmail,
} from '../middleware/auth.middleware.js';
import controller from '../controllers/".js';
import express from 'express';
const router = express.Router();

export default (app) => {
  // Retrieve all Transactions
  router.get('/', controller.findAll);

  // Update a Transaction with id
  router.get('/:userId', [verifyToken], controller.findByClient);

  // Revert a Transaction with id
  router.delete('/:transactionId', [verifyToken], controller.revert);

  // Sell products
  router.post('/products/', [verifyToken], controller.sellProducts);

  // // Sell a membership
  // router.post("/membership/", [verifyToken], controller.sellMembership);

  app.use('/transactions', router);
};
