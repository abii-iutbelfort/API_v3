import jwt from 'jsonwebtoken';
import config from '../config/auth.config.js';
import { AbiiUsers } from '../models/index.js';
import logger from '../utils/logger.utils.js';

export async function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    req.userId = decoded.id;
    next();
  });
}

export async function checkDuplicateUsernameOrEmail(req, res, next) {
  try {
    // Username
    const user = await AbiiUsers.findOne({
      where: {
        login: req.body.login,
      },
    });

    if (user) {
      return res.status(400).send({
        message: 'Failed! Username is already in use!',
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      message: 'Le serveur a rencontré une erreur.',
    });
    logger.error(error.message, error);
    return;
  }
}

// isAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRole().then((roles) => {
//       if (roles.dataValues.name === "admin") {
//         next();
//         return;
//       }

//       res.status(403).send({
//         message: "Require Admin Role!",
//       });
//       return;
//     });
//   });
// };

// isModerator = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRole().then((roles) => {
//       if (roles.dataValues.name === "moderator") {
//         next();
//         return;
//       }

//       res.status(403).send({
//         message: "Require Moderator Role!",
//       });
//     });
//   });
// };

// isModeratorOrAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRole().then((role) => {
//       if (role.dataValues.name === "moderator") {
//         next();
//         return;
//       }

//       if (role.dataValues.name === "admin") {
//         next();
//         return;
//       }

//       res.status(403).send({
//         message: "Require Moderator or Admin Role!",
//       });
//     });
//   });
// };
