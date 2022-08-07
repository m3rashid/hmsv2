const prisma = require("../utils/prisma");
const createAppointmentService = async ({ patientId, doctorId, date }) => {
  const appointment = {
    patientId: patientId,
    doctorId: doctorId,
    date,
  };

  try {
    const newAppointment = await prisma.Appointment.create({
      data: {
        ...appointment,
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    // const appointmentPatient = await newAppointment?.getPatient();
    // const appointmentDoctor = await newAppointment?.getDoctor();

    // console.log(appointmentPatient);
    // console.log(appointmentDoctor);

    return {
      appointment: newAppointment,
      id: newAppointment?.id,
      patient: appointmentPatient,
      doctor: appointmentDoctor,
    };
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
