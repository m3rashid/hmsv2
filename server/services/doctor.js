const dayjs = require("dayjs");
const prisma = require("../utils/prisma");

const getDoctorAppointmentsService = async (userId) => {
  console.log(userId);
  const appointments = await prisma.appointment.findMany({
    where: { doctorId: userId },
    include: { doctor: true, patient: true },
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
  const doctors = await prisma.Doctor.findMany({
    where: {
      name: {
        contains: name,
      },
      age: {
        gte: minAge,
      },
      age: {
        lte: maxAge,
      },
      designation: {
        contains: designation,
      },
      contact: {
        contains: contact,
      },
      address: {
        contains: address,
      },
    },
  });
  return { count: doctors.length, doctors };
};

const createPrescriptionByDoctorService = async ({
  appointment,
  symptoms,
  diagnosis,
  CustomMedicines,
  datetime,
  medicines,
}) => {
  // Fix this bad query
  const newPrescription = await prisma.prescription.create({
    data: {
      appointment: {
        connect: {
          id: appointment,
        },
      },
      symptoms,
      diagnosis,
      CustomMedicines,
      datePrescribed: dayjs(datetime).toDate(),
      medicines: {
        createMany: {
          data: medicines.map((medicine) => ({
            quantity: parseInt(medicine.quantity),
            dosage: medicine?.dosage,
            description: medicine.description,
            MedicineId: parseInt(medicine.name),
          })),
        },
      },
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
