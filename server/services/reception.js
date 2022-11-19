const { prisma } = require("../utils/prisma");
const { addEventLog } = require("../utils/logs");
const { serverActions } = require("../utils/constants");

const createAppointmentService = async ({
  patientId,
  doctorId,
  date,
  remarks,
  doneBy,
}) => {
  const newAppointment = await prisma.appointment.create({
    data: {
      date,
      remarks,
      patient: { connect: { id: patientId } },
      doctor: { connect: { id: doctorId } },
    },
    include: { patient: true, doctor: true },
  });

  const getDoctor = await prisma.auth.findFirst({
    where: { id: doctorId },
  });

  await addEventLog({
    action: serverActions.CREATE_APPOINTMENT,
    fromId: doneBy.id,
    actionId: newAppointment.id,
    actionTable: "appointment",
    message: `${doneBy.name} <(${doneBy.email})> created appointment for ${newAppointment.patient.name} with doctor ${getDoctor.name}`,
  });

  return newAppointment;
};

const getAppointmentByIdService = async (appointmentId) => {
  const appointment = await prisma.Appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true, doctor: true },
  });

  return {
    Appointment: appointment,
    id: appointment?.id,
  };
};

module.exports = {
  createAppointmentService,
  getAppointmentByIdService,
};
