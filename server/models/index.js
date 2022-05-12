import Sequelize from "sequelize";
import Appointment from "./Appointment.js";

import Auth from "./Auth.js";
import Doctor from "./Doctor.js";
import Medicine from "./Medicine.js";
import Patient from "./Patient.js";
import Prescription from "./Prescription.js";
import Receptionist from "./Receptionist.js";

const sequelize = new Sequelize({
  host: "localhost",
  dialect: "mysql",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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

export default db;
