const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Patients", deps: []
 * createTable() => "Doctors", deps: [Auths]
 * createTable() => "Prescriptions", deps: [Doctors, Patients, Medicines]
 * createTable() => "Receptionists", deps: [Auths]
 * addColumn(PatientId) => "Appointments"
 * addColumn(DoctorId) => "Appointments"
 *
 */

const info = {
  revision: 3,
  name: "noname",
  created: "2022-05-12T07:56:06.207Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "Patients",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        age: { type: Sequelize.INTEGER, field: "age", allowNull: false },
        lastVisit: {
          type: Sequelize.DATE,
          field: "lastVisit",
          allowNull: false,
        },
        contact: { type: Sequelize.STRING, field: "contact", allowNull: false },
        address: { type: Sequelize.STRING, field: "address", allowNull: false },
        email: { type: Sequelize.STRING, field: "email", allowNull: false },
        jamiaId: { type: Sequelize.STRING, field: "jamiaId", allowNull: false },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Doctors",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        availability: {
          type: Sequelize.STRING,
          field: "availability",
          allowNull: false,
        },
        age: { type: Sequelize.INTEGER, field: "age", allowNull: false },
        designation: {
          type: Sequelize.STRING,
          field: "designation",
          allowNull: false,
        },
        contact: { type: Sequelize.STRING, field: "contact", allowNull: false },
        email: { type: Sequelize.STRING, field: "email", allowNull: false },
        address: { type: Sequelize.STRING, field: "address", allowNull: false },
        AuthId: {
          type: Sequelize.UUID,
          field: "AuthId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Auths", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Prescriptions",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        description: {
          type: Sequelize.STRING,
          field: "description",
          allowNull: false,
        },
        datePrescribed: {
          type: Sequelize.DATE,
          field: "datePrescribed",
          allowNull: false,
        },
        dateExpiring: {
          type: Sequelize.DATE,
          field: "dateExpiring",
          allowNull: false,
        },
        DoctorId: {
          type: Sequelize.UUID,
          field: "DoctorId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Doctors", key: "id" },
          allowNull: true,
        },
        PatientId: {
          type: Sequelize.UUID,
          field: "PatientId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Patients", key: "id" },
          allowNull: true,
        },
        MedicineId: {
          type: Sequelize.UUID,
          field: "MedicineId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Medicines", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Receptionists",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        email: {
          type: Sequelize.STRING,
          field: "email",
          unique: true,
          allowNull: false,
        },
        contact: {
          type: Sequelize.STRING,
          field: "contact",
          unique: true,
          allowNull: false,
        },
        address: { type: Sequelize.STRING, field: "address", allowNull: false },
        AuthId: {
          type: Sequelize.UUID,
          field: "AuthId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Auths", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Appointments",
      "PatientId",
      {
        type: Sequelize.UUID,
        field: "PatientId",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "Patients", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Appointments",
      "DoctorId",
      {
        type: Sequelize.UUID,
        field: "DoctorId",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "Doctors", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Appointments", "PatientId", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Appointments", "DoctorId", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Doctors", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Patients", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Prescriptions", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Receptionists", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
