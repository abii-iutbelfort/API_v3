import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import createRouterFunctions from './routers/index.js';
import logger from './utils/logger.utils.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'yaml';

const app = express();

dotenv.config();

const PORT = process.env._ABII_API_PORT;
const HOST = process.env._ABII_API_HOST;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(cors({
  origin: 'http://92.141.153.49:8080',
}));

// Use routes defined in backend/routers
for (const createRouter of createRouterFunctions) {
  createRouter(app);
}

const file = fs.readFileSync('./swagger/doc.yml', 'utf8')
const swaggerDoc = yaml.parse(file)
console.log(swaggerDoc)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, { customSiteTitle: "API Documentation" }));

import db from './models/index.js';

logger.info('Connecting to database...');
db.sequelize
  .sync({ alter: true, logging: false })
  .then(() => {
    logger.success('Connected to database');
  })
  .catch((err) => logger.error(err.message, err));

logger.info('Starting Server...');
app.listen(PORT, () => {
  logger.success(`Server is running on port http://${HOST}:${PORT}`);
});
