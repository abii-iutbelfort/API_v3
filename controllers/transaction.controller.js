import logger from '../utils/logger.utils.js';
import {
  sequelize,
  Transactions,
  Products,
  ProductSales,
  Memberships,
  Clients,
} from '../models/index.js';

// Retrieve all Transactions from the database.
async function findAll(req, res) {
  try {
    const transactions = await Transactions.findAll({
      include: [Products, Memberships],
    });
    res.status(200).send({
      message: 'Transactions récupérés.',
      data: transactions,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur.',
    });
    logger.error(error.message, error);
  }
}

// Retrieve all Transactions of a User.
async function findByClient(req, res) {
  const clientId = req.params.userId;

  try {
    const transactions = await Transactions.findAll({
      where: {clientId},
      include: [
        {
          model: Products,
          through: {
            attributes: [],
          },
        },
        Memberships,
      ],
    });
    res.status(200).send({
      message: 'Transactions récupérés.',
      data: transactions,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur.',
    });
    logger.error(error.message, error);
  }
}

async function sellProducts(req, res) {
  const {clientId, products} = req.body;
  const transaction = await sequelize.transaction();

  try {
    const dbProducts = await Products.findAll(
        {
          where: {productId: Object.keys(products)},
        },
        {transaction},
    );
    const transactionValue = dbProducts.reduce(
        (partialSum, product) =>
          partialSum + product.productPrice * products[product.productId],
        0,
    );

    const client = await Clients.findByPk(clientId);
    if (!client) {
      logger.warn(`Failed transaction with client id : ${clientId}`);
      return res.status(404).send({
        message: 'Client non trouvé.',
      });
    }

    if (client.clientSolde < transactionValue) {
      logger.warn(`Failed transaction with client id : ${clientId}`);
      return res.status(400).send({
        message: 'Solde insuffisant.',
      });
    }

    await client.update(
        {
          clientSolde: client.clientSolde - transactionValue,
        },
        {transaction},
    );

    const newTransaction = await Transactions.create(
        {
          clientId,
          transactionValue,
          abiiUserId: req.userId,
          transactionStatus: 'paid',
        },
        {transaction},
    );

    for (const product of dbProducts) {
      if (product.productStock < products[product.productId]) {
        logger.warn(
            `Failed transaction with product id : ${product.productId}`,
        );
        return res.status(400).send({
          message: 'Stock insuffisant.',
        });
      }

      await product.update(
          {
            productStock: product.productStock - products[product.productId],
          },
          {transaction},
      );

      await ProductSales.create(
          {
            transactionId: newTransaction.transactionId,
            productId: product.productId,
            amountSold: products[product.productId],
          },
          {transaction},
      );
    }

    await transaction.commit();

    res.status(200).send({
      message: 'Transaction créée.',
      data: newTransaction,
    });
  } catch (error) {
    logger.error(error.message, error);
    await transaction.rollback();
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur.',
    });
  }
}

// Reverse a Transaction with the specified id
async function revert(req, res) {
  const {transactionId} = req.params;
  const transaction = await sequelize.transaction();

  try {
    const transactionToRevert = await Transactions.findByPk(transactionId, {
      include: [Products],
    });

    await transactionToRevert.products.forEach(async (product) => {
      await product.update(
          {
            productStock: product.productStock + product.product_sales.amountSold,
          },
          {transaction},
      );
    });

    // await transaction.setStatut(2);
    const client = await Clients.findByPk(transactionToRevert.clientId);
    await client.update(
        {
          clientSolde:
          parseFloat(client.clientSolde) +
          parseFloat(transactionToRevert.transactionValue),
        },
        {transaction},
    );

    await transactionToRevert.update(
        {transactionStatus: 'cancelled'},
        {transaction},
    );

    await transaction.commit();
    return res.status(200).send({
      message: 'Transaction annulée.',
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur.',
    });
    logger.error(error.message, error);
  }
}

export default {
  findAll,
  findByClient,
  sellProducts,
  revert,
};
