import {
  verifyToken,
  checkDuplicateUsernameOrEmail,
} from '../middleware/auth.middleware.js';
import controller from '../controllers/product.controller.js';
import express from 'express';
const router = express.Router();

export default (app) => {
  // Create a new Product
  router.post('/', [verifyToken], controller.create);

  // Retrieve all Products
  router.get('/', controller.findAll);

  // Update a Product with id
  router.put('/:id', [verifyToken], controller.update);

  // Destroy a Product with id
  router.delete('/:id', [verifyToken], controller.destroy);

  app.use('/products', router);
};
