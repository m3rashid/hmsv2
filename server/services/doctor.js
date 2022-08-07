const { UserDetails } = require("./auth.js");
const prisma = require("../utils/prisma");

const getDoctorAppointmentsService = async (userId) => {
  const Doc = await UserDetails(userId, "DOCTOR");
  const appointments = await prisma.Appointment.findMany({
    where: { doctorId: Doc.id },
    include: { doctor: true, patient: true },
    orderBy: { date: "desc" },
  });

  console.log(appointments);
  return { appointments };
};

// Hopefully this is the correct query
const getDoctorPatientsService = async (doctorId) => {
  const patients = await prisma.Patient.findMany({
    where: {
      Appointment: {
        some: {
          doctorId: doctorId,
        },
      },
    },
  });
  return { patients };
};

const createDoctorService = async (doctor) => {
  try {
    const newDoctor = await prisma.Doctor.create(doctor);
    return { newDoctor };
  } catch (err) {
    console.log(err);
    return new Error("Internal Server Error");
  }
};

const searchDoctorsService = async ({
  name,
  minAge,
  maxAge,
  designation,
  contact,
  email,
  address,
  availability,
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
    ...(designation && {
      designation: {
        contains: designation,
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
    ...(availability && {
      availability: {
        equals: availability === "true",
      },
    }),
    ...(email && {
      auth: {
        email: {
          contains: email,
        },
      },
    }),
  };

  const doctors = await prisma.Doctor.findMany({
    where: {
      ...whereClause,
    },
    include: {
      auth: {
        select: {
          email: true,
        },
      },
    },
  });
  return { count: doctors.length, doctors };
};

const createPrescriptionByDoctorService = async ({
  appointment,
  symptoms,
  diagnosis,
  customMedicines,
  datetime,
}) => {
  // Fix this bad query
  console.log(appointment, symptoms, diagnosis, customMedicines, datetime);
  const newPrescription = await prisma.Prescription.create({
    data: {
      appointmentId: appointment,
      symptoms,
      diagnosis,
      customMedicines,
      datePrescribed: datetime,
    },
    include: {
      appointment: true,
      // doctor: true,
      // patient: true,
    },
  });

  // const newPresDetails = await newPrescription.getAppointment();
  // const patient = await newPresDetails.getPatient();
  // const doctor = await newPresDetails.getDoctor();

  return {
    prescription: newPrescription,
    // doctor,
    // patient,
  };
};

module.exports = {
  getDoctorAppointmentsService,
  getDoctorPatientsService,
  createDoctorService,
  searchDoctorsService,
  createPrescriptionByDoctorService,
};
