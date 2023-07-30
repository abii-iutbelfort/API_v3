require("dotenv").config();

module.exports = {
  HOST: process.env._ABII_API_HOST,
  USER: process.env._ABII_API_USER,
  PASSWORD: process.env._ABII_API_MDP,
  DB: process.env._ABII_API_DB,
  dialect: "postgres",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
