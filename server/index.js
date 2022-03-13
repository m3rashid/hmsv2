import express from "express";
const app = express();
import "dotenv/config";
import sequelize from "./models/index.js";

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({
      // force: true
    });
    console.log(sequelize.models);

    console.log("Connection has been established successfully.");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
