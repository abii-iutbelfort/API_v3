import {
  verifyToken,
  checkDuplicateUsernameOrEmail,
} from "../middleware/auth.middleware.js";
import controller from "../controllers/client.controller.js";
import express from "express";
const router = express.Router();

export default (app) => {
  // Create a new Client
  router.post("/", [verifyToken], controller.create);

  // Retrieve all Clients
  router.get("/", [verifyToken], controller.findAll);

  // Destroy a Client with id
  router.delete("/:id", [verifyToken], controller.destroy);

  app.use("/clients", router);
};
