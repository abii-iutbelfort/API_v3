const db = require("../models");
const AbiiUsers = db.AbiiUsers;
logger = require("../utils/logger.utils");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Username
    const user = await AbiiUsers.findOne({
      where: {
        login: req.body.login,
      },
    });

    if (user) {
      return res.status(400).send({
        message: "Failed! Username is already in use!",
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      message: "Le serveur a rencontré une erreur.",
    });
    logger.error(error.message, error);
    return;
  }
};

// checkRolesExisted = (req, res, next) => {
//   if (req.body.roles) {
//     for (let i = 0; i < req.body.roles.length; i++) {
//       if (!ROLES.includes(req.body.roles[i])) {
//         res.status(400).send({
//           message: "Failed! Role does not exist = " + req.body.roles[i],
//         });
//         return;
//       }
//     }
//   }
//   next();
// };

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  //   checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
