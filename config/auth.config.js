import dotenv from "dotenv";
dotenv.config();

export default {
  secret: process.env._ABII_APP_SECRET,
};
