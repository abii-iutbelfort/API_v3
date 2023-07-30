const auth = require("../middleware/authJwt");
const controller = require("../controllers/tag.controller.js");
const router = require("express").Router();

module.exports = (app) => {
  // Create a new Tag
  router.post("/", [auth.verifyToken], controller.create);

  // Retrieve all Tags
  router.get("/", controller.findAll);

  // Update a Tag with id
  router.put("/:id", [auth.verifyToken], controller.update);

  // Delete a Tag with id
  router.delete("/:id", [auth.verifyToken], controller.delete);

  app.use("/tags", router);
};
