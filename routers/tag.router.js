import {
  verifyToken,
  checkDuplicateUsernameOrEmail,
} from '../middleware/auth.middleware.js';
import controller from '../controllers/tag.controller.js';
import express from 'express';
const router = express.Router();

export default (app) => {
  // Create a new Tag
  router.post('/', [verifyToken], controller.create);

  // Retrieve all Tags
  router.get('/', controller.findAll);

  // Update a Tag with id
  router.put('/:id', [verifyToken], controller.update);

  // Destroy a Tag with id
  router.delete('/:id', [verifyToken], controller.destroy);

  app.use('/tags', router);
};
