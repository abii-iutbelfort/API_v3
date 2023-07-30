const db = require("../models");
const Products = db.Products;
const logger = require("../utils/logger.utils");

// Create and Save a new Product
exports.create = async (req, res) => {
  const { productLibelle, productPrice, productStock, productTags } = req.body;

  const newProduct = {
    productLibelle,
    productPrice,
    productStock,
  };

  try {
    let product = await Products.findOne({
      where: { productLibelle },
    });

    if (product) {
      return res.status(409).send({
        message: "Ce produit existe déjà.",
      });
    }
    product = await Products.create(newProduct);
    if (productTags) {
      await product.setTags(productTags);
    }

    res.status(200).send({
      message: "Product créé.",
      data: product,
    });
  } catch (error) {
    logger.error(error.message, error);
    res.status(500).send({
      message: "Le serveur a rencontré une erreur.",
    });
  }
};

// Retrieve all Products from the database.
exports.findAll = async (req, res) => {
  try {
    let products = await Products.findAll({
      include: {
        model: db.Tags,
        attributes: ["tagId", "tagLibelle"],
        through: {
          attributes: [],
        },
      },
    });
    res.status(200).send({
      message: "Produits récupérés.",
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      message: "Le serveur a rencontré une erreur.",
    });
    logger.error(error.message, error);
  }
};

// Update a Product by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  const { productLibelle, productPrice, productStock, productTags } = req.body;

  const newValue = {
    productLibelle,
    productPrice,
    productStock,
    productTags,
  };
  console.log(req.body);
  try {
    const updatedProducts = await Products.update(newValue, {
      where: {
        productId: id,
      },
      returning: true,
    });

    if (updatedProducts[0] > 0) {
      res.status(200).send({
        message: "Produit mis à jour.",
        data: updatedProducts,
      });
    } else {
      logger.warn(`Failed product update with id : ${id}`);
      res.status(404).send({
        message: "Pas de product correspondant",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Le serveur a rencontré une erreur",
    });
    logger.error(error.message, error);
  }
};

// Delete a Product with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedCount = await Products.destroy({
      where: { productId: id },
    });

    if (deletedCount === 1) {
      res.status(200).send({
        message: "Produits a bien été supprimé.",
      });
    } else {
      res.status(404).send({
        message: "Pas de produits correspondant",
      });
      logger.warn(`Failed product delete with id : ${id}`);
    }
  } catch (error) {
    res.status(500).send({
      message: "Le serveur a rencontré une erreur.",
    });
    logger.error(error.message, error);
  }
};
