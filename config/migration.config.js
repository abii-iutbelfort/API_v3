import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export default {
  development: {
    username: process.env._ABII_API_USER,
    password: process.env._ABII_API_MDP,
    database: process.env._ABII_API_DB,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true,
      ssl: {
        // ca: fs.readFileSync(__dirname + '/postgres-ca-main.crt')
      }
    }
  }
};