import db from "../models/index.js";

export const getDoctorAppointmentsService = async (doctorId) => {
  const appointments = await db.Doctor.findAll({
    where: { id: doctorId },
    include: [{ model: db.Appointment, as: "Appointments" }],
  });
  console.log(appointments);
  return { appointments };
};

export const getDoctorPatientsService = async (doctorId) => {
  const patients = await db.Patients.findAll({
    where: {},
  });
  return { patients };
};
