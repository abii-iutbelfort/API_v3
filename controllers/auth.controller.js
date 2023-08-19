import config from '../config/auth.config.js';
import { AbiiUsers } from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger.utils.js';

async function signup(req, res) {
  const { login, firstname, lastname, password } = req.body;
  const userData = {
    firstname,
    lastname,
    login,
    password,
  };
  console.log(userData);
  try {
    const { firstname, lastname, login } = await AbiiUsers.create(userData);
    res.status(200).send({
      message: 'User ABII créé.',
      data: {
        firstname,
        lastname,
        login,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur.',
    });
    logger.error(error.message, error);
  }
}

async function signin(req, res) {
  try {
    const user = await AbiiUsers.findOne({
      where: {
        login: req.body.login,
      },
    });

    if (!user) {
      return res.status(404).send({
        message: 'Pas d\'utilisateur ABII correspondant.',
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password,
    );

    if (!passwordIsValid) {
      logger.warn(`Failed login attempt for user : ${user.login}`);
      return res.status(401).send({
        message: 'Mot de passe invalide.',
      });
    }
    const accessToken = jwt.sign({ id: user.userId }, config.secret, {
      expiresIn: 43200, // 12 hours
    });

    res.status(200).send({
      message: 'Connexion réussie.',
      data: {
        userData: {
          firstname: user.firstname,
          lastname: user.lastname,
          login: user.login,
        },
        accessToken,
      },
    });
  } catch (error) {
    res.status(500).send({ message: 'Le serveur a rencontré une erreur. 222' });
    logger.error(error.message, error);
  }
}

// Destroy a User with the specified id in the request
async function destroy(req, res) {
  const id = req.params.id;

  try {
    const destroyCount = await AbiiUsers.destroy({
      where: { userId: id },
    });
    if (destroyCount > 0) {
      res.status(200).send({
        message: 'User was destroyd successfully!',
      });
    } else {
      res.status(404).send({
        message: 'Pas d\'utilisateur ABII correspondant.',
      });
      logger.warn(`Failed user destroy with id : ${id}`);
    }
  } catch (error) {
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur.333',
    });
    logger.error(error.message, error);
  }
}

export default {
  signup,
  signin,
  destroy,
};
