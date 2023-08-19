import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import createRouterFunctions from './routers/index.js';

const app = express();
import logger from './utils/logger.utils.js';
import path from 'path';

const corsOptions = {
  // origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

dotenv.config();

const PORT = process.env._ABII_API_PORT;
const HOST = process.env._ABII_API_HOST;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(function (req, res, next) {
//   res.header(
//     "Access-Control-Allow-Headers",
//     "x-access-token, Origin, Content-Type, Accept"
//   );
//   next();
// });

// Use routes defined in backend/routers
for (const createRouter of createRouterFunctions) {
  createRouter(app);
}

import db from './models/index.js';

logger.info('Connecting to database...');
db.sequelize
    .sync({alter: true, logging: false})
    .then(() => {
      logger.success('Connected to database');
    })
    .catch((err) => logger.error(err.message, err));

logger.info('Starting Server...');
app.listen(PORT, () => {
  logger.success(`Server is running on port http://${HOST}:${PORT}`);
});
