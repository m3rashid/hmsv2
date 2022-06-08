"use strict";

import { Sequelize } from "sequelize";
import Appointment from "./Appointment.js";
import Auth from "./Auth.js";
import Doctor from "./Doctor.js";
import Medicine from "./Medicine.js";
import Patient from "./Patient.js";
import Prescription from "./Prescription.js";
import Receptionist from "./Receptionist.js";
import fs from "fs";
import path from "path";
const __dirname = path.resolve();

// read json from config file
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, `/config/config.json`), "utf8")
);

const useConfig = "development";

const sequelize = new Sequelize({
  host: config[useConfig]?.host,
  dialect: config[useConfig]?.dialect,
  username: config[useConfig]?.username,
  password: config[useConfig]?.password,
  database: config[useConfig]?.database,
});

const db = {
  Auth: Auth(sequelize, Sequelize.DataTypes, Sequelize.Model),
  Medicine: Medicine(sequelize, Sequelize.DataTypes, Sequelize.Model),
  Appointment: Appointment(sequelize, Sequelize.DataTypes, Sequelize.Model),
  Doctor: Doctor(sequelize, Sequelize.DataTypes, Sequelize.Model),
  Patient: Patient(sequelize, Sequelize.DataTypes, Sequelize.Model),
  Prescription: Prescription(sequelize, Sequelize.DataTypes, Sequelize.Model),
  Receptionist: Receptionist(sequelize, Sequelize.DataTypes, Sequelize.Model),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
