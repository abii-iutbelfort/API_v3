import {
  verifyToken,
  checkDuplicateUsernameOrEmail,
} from '../middleware/auth.middleware.js';
import controller from '../controllers/client.controller.js';
import express from 'express';
const router = express.Router();

export default (app) => {
  router.use([verifyToken])

  // Create a new Client
  router.post('/', controller.create);

  // Retrieve all Clients
  router.get('/', controller.findAll);

  // Retrieve a Client by its id
  router.get('/:id', controller.findByPk);

  // Retrieve a Client by its UUID
  router.get('/uuid/:uuid', controller.findByUuid);

  // Destroy a Client with id
  router.delete('/:id', controller.destroy);

  app.use('/clients', router);
};
