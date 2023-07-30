const auth = require("../middleware/authJwt");
const controller = require("../controllers/product.controller.js");
const router = require("express").Router();

module.exports = (app) => {
  // Create a new Product
  router.post("/", [auth.verifyToken], controller.create);

  // Retrieve all Products
  router.get("/", controller.findAll);

  // Update a Product with id
  router.put("/:id", [auth.verifyToken], controller.update);

  // Delete a Product with id
  router.delete("/:id", [auth.verifyToken], controller.delete);

  app.use("/products", router);
};
