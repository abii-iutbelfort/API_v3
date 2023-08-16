import db from '../models/index.js';
const Clients = db.Clients;
import logger from '../utils/logger.utils.js';

// Create and Save a new Client
async function create(req, res) {
  const t = await db.sequelize.transaction();
  try {
    const client = await Clients.findOrCreate({
      where: {
        clientFirstName: req.body.clientFirstName,
        clientLastName: req.body.clientLastName,
      },
    });

    if (!client[1]) {
      return res.status(409).send({
        message: 'Ce client existe déjà.',
      });
    }

    if (req.body.clientSolde) {
      await client[0].update({clientSolde: req.body.clientSolde});
    }

    await t.commit();
    res.status(200).send({
      message: 'Client créé.',
      data: client[0],
    });
  } catch (error) {
    await t.rollback();
    logger.error(error.message, error);
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur.',
    });
  }
}

// Retrieve all Clients from the database.
async function findAll(req, res) {
  try {
    const clients = await Clients.findAll();
    res.status(200).send({
      message: 'Clients récupérés.',
      data: clients,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur.',
    });
    logger.error(error.message, error);
  }
}

// Destroy a Client with the specified id in the request
async function destroy(req, res) {
  const id = req.params.id;

  try {
    const destroydCount = await Clients.destroy({
      where: {clientId: id},
    });

    if (destroydCount === 1) {
      res.status(200).send({
        message: 'Client a bien été supprimé.',
      });
    } else {
      res.status(404).send({
        message: 'Pas de client correspondant',
      });
      logger.warn(`Failed client destroy with id : ${id}`);
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
  destroy,
};
