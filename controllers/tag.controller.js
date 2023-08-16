import db from "../models/index.js";
const Tags = db.Tags;
import logger from "../utils/logger.utils.js";

// Create and Save a new Tag
async function create(req, res) {
  try {
    const tag = await Tags.findOrCreate({
      where: { tagLibelle: req.body.tagLibelle },
    });

    if (!tag[1]) {
      return res.status(409).send({
        message: "Ce tag existe déjà.",
      });
    }

    res.status(200).send({
      message: "Tag créé.",
      data: tag[0],
    });
  } catch (error) {
    logger.error(error.message, error);
    res.status(500).send({
      message: "Le serveur a rencontré une erreur.",
    });
  }
}

// Retrieve all Tags from the database.
async function findAll(req, res) {
  try {
    let tags = await Tags.findAll();
    res.status(200).send({
      message: "Tags récupérés.",
      data: tags,
    });
  } catch (error) {
    res.status(500).send({
      message: "Le serveur a rencontré une erreur.",
    });
    logger.error(error.message, error);
  }
}

// Update a Tag by the id in the request
async function update(req, res) {
  const id = req.params.id;
  const newValue = { tagLibelle: req.body.tagLibelle };

  try {
    const updatedTags = await Tags.update(newValue, {
      where: {
        tagId: id,
      },
    });

    if (updatedTags[0] > 0) {
      res.status(200).send({
        message: "Tag mis à jour.",
      });
    } else {
      logger.warn(`Failed tag update with id : ${id}`);
      res.status(404).send({
        message: "Pas de tag correspondant",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Le serveur a rencontré une erreur",
    });
    logger.error(error.message, error);
  }
}

// Destroy a Tag with the specified id in the request
async function destroy(req, res) {
  const id = req.params.id;

  try {
    const destroydCount = await Tags.destroy({
      where: { tagId: id },
    });

    if (destroydCount === 1) {
      res.status(200).send({
        message: "Tag a bien été supprimé.",
      });
    } else {
      res.status(404).send({
        message: "Pas de tag correspondant",
      });
      logger.warn(`Failed tag destroy with id : ${id}`);
    }
  } catch (error) {
    res.status(500).send({
      message: "Le serveur a rencontré une erreur.",
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
