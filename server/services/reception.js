import db from "../models/index.js";

export const createAppointmentService = async ({
  patientId,
  doctorId,
  patient,
  doctor,
  date,
}) => {
  const appointment = {
    PatientId: patientId,
    DoctorId: doctorId,
    date,
  };

  try {
    console.log(appointment);
    const newAppointment = await db.Appointment.create(appointment, {
      include: [
        {
          model: db.Patient,
          as: "Patient",
        },
        {
          model: db.Doctor,
          as: "Doctor",
        },
      ],
      plain: true,
      raw: true,
    });

    const appointmentPatient = await newAppointment.getPatient();
    const appointmentDoctor = await newAppointment.getDoctor();

    console.log(appointmentPatient);
    console.log(appointmentDoctor);

    return {
      Appointment: newAppointment,
      id: newAppointment?.id,
      patient: appointmentPatient,
      doctor: appointmentDoctor,
    };
  } catch (err) {
    console.log(err);
    return new Error("Internal Server Error");
  }
};

export const getAppointmentByIdService = async (appointmentId) => {
  try {
    const appointment = await db.Appointment.findOne(
      {
        where: {
          id: appointmentId,
        },
        include: [
          {
            model: db.Patient,
            as: "Patient",
          },
          {
            model: db.Doctor,
            as: "Doctor",
          },
        ],
      },
      {
        raw: true,
        plain: true,
      }
    );

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
