const express = require("express");
const cors = require("cors");

const app = express();
const logger = require("./utils/logger.utils");
const path = require("path");

var corsOptions = {
  // origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

require("dotenv").config({
  path: path.resolve(__dirname, "./.env"),
});

const PORT = process.env._ABII_API_PORT;
const HOST = process.env._ABII_API_HOST;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(function (req, res, next) {
//   res.header(
//     "Access-Control-Allow-Headers",
//     "x-access-token, Origin, Content-Type, Accept"
//   );
//   next();
// });

// Use routes defined in backend/routers
for (const file of require("fs").readdirSync("./routers")) {
  if (file.endsWith(".router.js")) {
    require(`./routers/${file}`)(app);
  }
}

const db = require("./models");

logger.info("Connecting to database...");
db.sequelize
  .sync({ alter: true, logging: false })
  .then(() => {
    logger.success("Connected to database");
  })
  .catch((err) => logger.error(err.message, err));

logger.info("Starting Server...");
app.listen(PORT, () => {
  logger.success(`Server is running on port http://${HOST}:${PORT}`);
});
