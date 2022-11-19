const { prisma } = require("../utils/prisma");
const { addEventLog } = require("../utils/logs");
const { serverActions } = require("../utils/constants");

const addTest = async ({
  name,
  description,
  prescriptionId,
  testType,
  doneBy,
}) => {
  if (!name || !prescriptionId || !testType) {
    throw new Error("Insufficient data");
  }

  const newTest = await prisma.test.create({
    data: {
      name,
      description,
      prescriptionId,
      testType,
    },
  });

  const getNewTest = await prisma.test.findFirst({
    where: { id: newTest.id },
    include: {
      prescription: {
        select: {
          appointment: {
            select: {
              patient: { select: { name: true, contact: true } },
            },
          },
        },
      },
    },
  });

  await addEventLog({
    action: serverActions.CREATE_TEST,
    fromId: doneBy.id,
    actionId: newTest.id,
    actionTable: "test",
    message: `${doneBy.name} <(${doneBy.email})> added new test ${getNewTest.name} for patient ${getNewTest.prescription.appointment.patient.name}`,
  });

  return newTest;
};

const editTest = async ({ testId, doneBy, ...values }) => {
  if (!testId) throw new Error("Insufficient data");

  const test = await prisma.test.update({
    where: { id: testId },
    data: values,
  });

  const getNewTest = await prisma.test.findFirst({
    where: { id: testId },
    include: {
      prescription: {
        select: {
          appointment: {
            select: {
              patient: { select: { name: true, contact: true } },
            },
          },
        },
      },
    },
  });

  await addEventLog({
    action: serverActions.EDIT_TEST,
    fromId: doneBy.id,
    actionId: test.id,
    actionTable: "test",
    message: `${doneBy.name} <(${doneBy.email})> edited test ${getNewTest.name} for patient ${getNewTest.prescription.appointment.patient.name}`,
  });

  return test;
};

const deleteTest = async ({ testId, doneBy }) => {
  if (!testId) throw new Error("Insufficient data");

  const getNewTest = await prisma.test.findFirst({
    where: { id: testId },
    include: {
      prescription: {
        select: {
          appointment: {
            select: {
              patient: { select: { name: true, contact: true } },
            },
          },
        },
      },
    },
  });

  const test = await prisma.test.delete({ where: { id: testId } });

  await addEventLog({
    action: serverActions.DELETE_TEST,
    fromId: doneBy.id,
    actionId: testId,
    actionTable: "test",
    message: `${doneBy.name} <(${doneBy.email})> deleted test ${getNewTest.name} for patient ${getNewTest.prescription.appointment.patient.name}`,
  });

  return test;
};

const getTest = async ({ testId, prescriptionId }) => {
  if (!testId && !prescriptionId) throw new Error("Insufficient data");

  const test = await prisma.test.findUnique({
    where: {
      OR: [{ id: testId }, { prescriptionId: prescriptionId }],
    },
    include: { prescription: true },
  });
  return test;
};

const getTestsByType = async ({ testType }) => {
  if (!testType) throw new Error("Insufficient data");

  const tests = await prisma.test.findMany({
    where: { testType },
    include: { prescription: true },
  });
  return tests;
};

const getAllTests = async ({}) => {
  const tests = await prisma.test.findMany({
    include: { prescription: true },
  });
  return tests;
};

module.exports = {
  addTest,
  editTest,
  deleteTest,
  getTest,
  getTestsByType,
  getAllTests,
};
