const prisma = require("../utils/prisma");

const createPatientService = async ({
  name,
  age,
  sex,
  contact,
  address,
  email,
  jamiaId,
}) => {
  if (!name || !age || !sex || !contact || !email)
    throw new Error("Missing credentials");

  const newPatient = await prisma.Patient.create({
    data: { name, age, sex, contact, address, email, jamiaId },
  });

  return { patient: newPatient };
};

const deletePatientService = async (patientId) => {
  const patient = await prisma.Patient.delete({
    where: { id: patientId },
  });
  if (!patient) throw new Error("Patient not found");

  return;
};

const getPatientByIdService = async (patientId) => {
  const patient = await prisma.Patient.findUnique({
    where: { id: patientId },
  });
  if (!patient) throw new Error("Patient not found");

  return { patient };
};

const searchPatientsService = async ({
  name,
  minAge,
  maxAge,
  sex,
  contact,
  address,
  email,
  jamiaId,
  lastVisitedBefore,
  lastVisitedAfter,
}) => {
  const patients = await prisma.Patient.findMany({
    where: {
      name: {
        contains: name,
      },
      age: {
        gte: minAge,
      },
      age: {
        lte: maxAge,
      },
      sex: {
        eq: sex,
      },
      contact: {
        contains: contact,
      },
      address: {
        contains: address,
      },
      email: {
        contains: email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { count: patients.length, patients };
};

module.exports = {
  createPatientService,
  deletePatientService,
  getPatientByIdService,
  searchPatientsService,
};
