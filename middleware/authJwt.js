const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const User = db.users;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

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

const authJwt = {
  verifyToken,
  //   isAdmin,
  //   isModerator,
  //   isModeratorOrAdmin,
};
module.exports = authJwt;
