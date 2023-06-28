const { prisma } = require('../utils/prisma');
const { addEventLog } = require('../utils/logs');
const { checkAccess } = require('../utils/auth.helpers');
const { permissions, serverActions } = require('../utils/constants');
const { faker } = require('@faker-js/faker');
const { Sex, BloodGroup, MaritalStatus } = require('@prisma/client');

const addDummyPatientsService = async () => {
  await prisma.patient.create({
    data: {
      name: faker.name.firstName(),
      type: 'EMPLOYEE',
      address: faker.address.secondaryAddress(),
      userId: faker.datatype.uuid(),
      fathersName: faker.name.firstName(),
      sex: faker.helpers.arrayElement(Object.values(Sex)),
      bloodGroup: faker.helpers.arrayElement(Object.values(BloodGroup)),
      dob: faker.date.past(),
      department: faker.commerce.department(),
      contact: faker.phone.phoneNumber(),
      maritalStatus: faker.helpers.arrayElement(Object.values(MaritalStatus)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
};

const createPatientService = async (data, UserPermissions, doneBy) => {
  if (!checkAccess([permissions.RECEPTION_CREATE_PATIENT], UserPermissions)) {
    throw new Error('Forbidden');
  }

  const newPatient = await prisma.patient.create({ data });

  await addEventLog({
    action: serverActions.CREATE_PATIENT,
    fromId: doneBy.id,
    actionId: newPatient.id,
    actionTable: 'patient',
    message: `${doneBy?.name} <(${doneBy?.email})> created patient  ${data?.name}`,
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

  if (!patient) throw new Error('Patient not found');

  await addEventLog({
    action: serverActions.DELETE_PATIENT,
    fromId: doneBy.id,
    actionId: patientId,
    actionTable: 'patient',
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
  if (!patient) throw new Error('Patient not found');

  return { patient };
};

const searchPatientsService = async ({ query }) => {
  const patients = await prisma.Patient.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { userId: { contains: query, mode: 'insensitive' } },
        { contact: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });

  return { count: patients.length, patients };
};

module.exports = {
  createPatientService,
  deletePatientService,
  getPatientByIdService,
  searchPatientsService,
  addDummyPatientsService,
};
