import { Op } from "sequelize";

import db from "../models/index.js";

export const createPatientService = async (
  name,
  age,
  sex,
  contact,
  address,
  email,
  jamiaId
) => {
  if (!name || !age || !sex || !contact || !email)
    throw new Error("Missing credentials");

  const newPatient = await db.Patient.create({
    name,
    age,
    sex,
    contact,
    address,
    email,
    jamiaId,
  });
  return { newPatient };
};

export const deletePatientService = async (patientId) => {
  const patient = await db.Patient.findOne({
    where: {
      id: patientId,
    },
  });
  if (!patient) throw new Error("Patient not found");

  await patient.destroy();
  return;
};

export const getPatientByIdService = async (patientId) => {
  const patient = await db.Patient.findOne({
    where: {
      id: patientId,
    },
  });
  if (!patient) throw new Error("Patient not found");

  return { patient };
};

export const searchPatientsService = async (
  name,
  minAge,
  maxAge,
  sex,
  contact,
  address,
  email,
  jamiaId,
  lastVisitedBefore,
  lastVisitedAfter
) => {
  const whereClause = {};
  if (name) {
    whereClause.name = { [Op.like]: `%${name}%` };
  }
  if (minAge) {
    whereClause.age = { [Op.gte]: minAge };
  }
  if (maxAge) {
    whereClause.age = { [Op.lte]: maxAge };
  }
  if (sex) {
    whereClause.sex = { [Op.eq]: sex };
  }

  if (contact) {
    whereClause.contact = { [Op.like]: `%${contact}%` };
  }
  if (address) {
    whereClause.address = { [Op.like]: `%${address}%` };
  }
  if (email) {
    whereClause.email = { [Op.like]: `%${email}%` };
  }
  if (jamiaId) {
    whereClause.jamiaId = { [Op.like]: `%${jamiaId}%` };
  }
  if (lastVisitedBefore) {
    whereClause.lastVisit = {
      [Op.lte]: new Date(lastVisitedBefore).toISOString(),
    };
  }
  if (lastVisitedAfter) {
    whereClause.lastVisit = {
      [Op.gte]: new Date(lastVisitedAfter).toISOString(),
    };
  }

  const patients = await db.Patient.findAll({
    where: whereClause,
    attributes: [
      "id",
      "name",
      "age",
      "sex",
      "contact",
      "address",
      "email",
      "jamiaId",
      "lastVisit",
    ],
    order: [["createdAt", "DESC"]],
  });
  return { count: patients.length, patients };
};
