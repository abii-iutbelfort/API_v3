const db = require("../models");
const Tags = db.Tags;
const logger = require("../utils/logger.utils");

// Create and Save a new Tag
exports.create = async (req, res) => {
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
};

// Retrieve all Tags from the database.
exports.findAll = async (req, res) => {
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
};

// Update a Tag by the id in the request
exports.update = async (req, res) => {
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
};

// Delete a Tag with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedCount = await Tags.destroy({
      where: { tagId: id },
    });

    if (deletedCount === 1) {
      res.status(200).send({
        message: "Tag a bien été supprimé.",
      });
    } else {
      res.status(404).send({
        message: "Pas de tag correspondant",
      });
      logger.warn(`Failed tag delete with id : ${id}`);
    }
  } catch (error) {
    res.status(500).send({
      message: "Le serveur a rencontré une erreur.",
    });
    logger.error(error.message, error);
  }
};
