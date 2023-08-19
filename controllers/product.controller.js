import db from '../models/index.js';
const Products = db.Products;
import logger from '../utils/logger.utils.js';

// Create and Save a new Product
async function create(req, res) {
  const { productLibelle, productNormalPrice, productStock, productTags } = req.body;
  const transaction = await db.sequelize.transaction();

  try {
    let product = await Products.findOne({
      where: { productLibelle },
    });

    if (product) {
      return res.status(409).send({
        message: 'Ce produit existe déjà.',
      });
    }

    const newProduct = {
      productLibelle,
      productNormalPrice,
      productStock,
    };

    product = await Products.create(newProduct, { transaction });

    if (productNormalPrice) {
      await product.update({ productNormalPrice }, { transaction });
    }
    if (productStock) {
      await product.update({ productStock }, { transaction });
    }
    if (productTags) {
      await product.setTags(productTags, { transaction });
    }

    await transaction.commit();
    res.status(200).send({
      message: 'Product créé.',
      data: product,
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(error.message, error);
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur.',
    });
  }
}

// Retrieve all Products from the database.
async function findAll(req, res) {
  try {
    const products = await Products.findAll({
      include: {
        model: db.Tags,
        attributes: ['tagId', 'tagLibelle'],
        through: {
          attributes: [],
        },
      },
    });
    res.status(200).send({
      message: 'Produits récupérés.',
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur.',
    });
    logger.error(error.message, error);
  }
}

// Update a Product by the id in the request
async function update(req, res) {
  const id = req.params.id;

  const { productLibelle, productNormalPrice, productStock, productTags } = req.body;

  const newValue = {
    productLibelle,
    productNormalPrice,
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
        message: 'Produit mis à jour.',
        data: updatedProducts[1],
      });
    } else {
      logger.warn(`Failed product update with id : ${id}`);
      res.status(404).send({
        message: 'Pas de product correspondant',
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur',
    });
    logger.error(error.message, error);
  }
}

// Destroy a Product with the specified id in the request
async function destroy(req, res) {
  const id = req.params.id;

  try {
    const destroydCount = await Products.destroy({
      where: { productId: id },
    });

    if (destroydCount === 1) {
      res.status(200).send({
        message: 'Produits a bien été supprimé.',
      });
    } else {
      res.status(404).send({
        message: 'Pas de produits correspondant',
      });
      logger.warn(`Failed product destroy with id : ${id}`);
    }
  } catch (error) {
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur.',
    });
    logger.error(error.message, error);
  }
}

export default {
  create,
  findAll,
  update,
  destroy,
};
