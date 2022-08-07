const prisma = require("../utils/prisma");

const createPatientService = async (
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

  const newPatient = await prisma.Patient.create({
    data: { name, age, sex, contact, address, email, jamiaId },
  });

  return { newPatient };
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
  const whereClause = {
    ...(name && {
      name: {
        contains: name,
      },
    }),
    ...((minAge || maxAge) && {
      age: {
        ...(minAge && {
          gte: parseInt(minAge),
        }),
        ...(maxAge && {
          lte: parseInt(maxAge),
        }),
      },
    }),
    ...(sex && {
      sex: {
        equals: sex,
      },
    }),
    ...(contact && {
      contact: {
        contains: contact,
      },
    }),
    ...(address && {
      address: {
        contains: address,
      },
    }),
    ...(email && {
      email: {
        contains: email,
      },
    }),
    ...(jamiaId && {
      jamiaId: {
        contains: jamiaId,
      },
    }),
    ...((lastVisitedAfter || lastVisitedBefore) && {
      lastVisit: {
        ...(lastVisitedBefore && {
          lte: new Date(lastVisitedBefore).toISOString(),
        }),
        ...(lastVisitedAfter && {
          gte: new Date(lastVisitedAfter).toISOString(),
        }),
      },
    }),
  };
  console.log("Query:", whereClause);

  const patients = await prisma.Patient.findMany({
    where: { ...whereClause },
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
