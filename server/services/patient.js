const prisma = require("../utils/prisma");
const { permissions, serverActions } = require("../utils/constants");
const { checkAccess } = require("../utils/auth.helpers");
const { addEventLog } = require("../utils/logs");

const createPatientService = async (
  { name, age, sex, contact, address, email, jamiaId },
  UserPermissions,
  createdBy
) => {
  if (!checkAccess([permissions.RECEPTION_CREATE_PATIENT], UserPermissions)) {
    throw new Error("Forbidden");
  }

  const data = { name, age, sex, contact, address, email, jamiaId };
  if (!name || !age || !sex || !contact || !email) {
    throw new Error("Missing credentials");
  }

  const newPatient = await prisma.patient.create({ data });

  await addEventLog({
    action: serverActions.CREATE_PATIENT,
    fromId: createdBy,
    actionId: newPatient.id,
    actionTable: "patient",
  });

  return { patient: newPatient };
};

const deletePatientService = async ({ patientId, createdBy }) => {
  const patient = await prisma.patient.delete({
    where: { id: patientId },
  });

  if (!patient) throw new Error("Patient not found");

  await addEventLog({
    action: serverActions.DELETE_PATIENT,
    fromId: createdBy,
    actionId: patientId,
    actionTable: "patient",
  });

  return patient;
};

const getPatientByIdService = async (patientId) => {
  const patient = await prisma.patient.findUnique({
    where: {
      id: parseInt(patientId),
    },
    include: {
      Appointment: {
        include: {
          doctor: true,
          Prescription: {
            include: {
              medicines: {
                include: {
                  Medicine: true,
                },
              },
              Test: true,
            },
          },
        },
      },
    },
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
      OR: [
        { name: { contains: name } },
        { age: { gte: minAge, lte: maxAge } },
        { sex: { eq: sex } },
        { contact: { contains: contact } },
        { address: { contains: address } },
        { email: { contains: email } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return { count: patients.length, patients };
};

module.exports = {
  createPatientService,
  deletePatientService,
  getPatientByIdService,
  searchPatientsService,
};
