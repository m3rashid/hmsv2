const { prisma } = require("../utils/prisma");
const { addEventLog } = require("../utils/logs");
const { checkAccess } = require("../utils/auth.helpers");
const { permissions, serverActions } = require("../utils/constants");

const createPatientService = async (
  { name, age, sex, contact, address, email, jamiaId },
  UserPermissions,
  doneBy
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
    fromId: doneBy.id,
    actionId: newPatient.id,
    actionTable: "patient",
    message: `${doneBy.name} <(${doneBy.email})> created patient  ${name}  <(${email})>`,
  });

  return { patient: newPatient };
};

const deletePatientService = async ({ patientId, doneBy }) => {
  const pastPatient = await prisma.patient.findFirst({
    where: { id: patientId },
  });

  const patient = await prisma.patient.delete({
    where: { id: patientId },
  });

  if (!patient) throw new Error("Patient not found");

  await addEventLog({
    action: serverActions.DELETE_PATIENT,
    fromId: doneBy.id,
    actionId: patientId,
    actionTable: "patient",
    message: `${doneBy.name} <(${doneBy.email})> deleted patient  ${pastPatient.name}  <(${pastPatient.email})>`,
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
