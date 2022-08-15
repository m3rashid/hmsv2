const prisma = require("../utils/prisma");

const createAppointmentService = async ({
  patientId,
  doctorId,
  patient,
  doctor,
  date,
}) => {
  try {
    const newAppointment = await prisma.Appointment.create({
      data: {
        date,
        patient: {
          connect: {
            id: patientId,
          },
        },
        doctor: {
          connect: {
            id: doctorId,
          },
        },
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    return newAppointment;
  } catch (err) {
    console.log(err);
    return new Error("Internal Server Error");
  }
};

const getAppointmentByIdService = async (appointmentId) => {
  try {
    const appointment = await prisma.Appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        doctor: true,
      },
    });

    console.log(appointment);

    return {
      Appointment: appointment,
      id: appointment?.id,
    };
  } catch (err) {
    console.log(err);
    return new Error("Internal Server Error");
  }
};

module.exports = {
  createAppointmentService,
  getAppointmentByIdService,
};
