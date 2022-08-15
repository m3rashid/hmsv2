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

// FIX this bad query
const getDoctorPatientsService = async (doctorId) => {
  const patients = await prisma.Patient.findMany({
    where: {},
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
}) => {
  // FIX this bad query
  // const whereClause = {
  //   ...(name && { name: { [Op.like]: `%${name}%` } }),
  //   ...(minAge && { age: { [Op.gte]: minAge } }),
  //   ...(maxAge && { age: { [Op.lte]: maxAge } }),
  //   ...(minAge && { [Op.gte]: minAge }),
  //   ...(designation && { [Op.like]: designation }),
  //   ...(contact && { [Op.like]: `%${contact}%` }),
  //   ...(address && { [Op.like]: `%${address}%` }),
  //   ...(email && { [Op.like]: `%${email}%` }),
  // };

  // console.log(whereClause);

  const doctors = await prisma.doctor.findMany({
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

  console.log(doctors);
  return { count: doctors.length, doctors };
};

const createPrescriptionByDoctorService = async (
  appointment,
  symptoms,
  prescription,
  CustomMedicines,
  datetime
) => {
  // Fix this bad query
  const newPrescription = await prisma.prescription.create({
    data: {
      appointment: {
        connect: {
          id: appointment.id,
        },
      },
      symptoms,
      prescription,
      CustomMedicines,
      datePrescribed: datetime,
    },
    include: {
      appointment: true,
      doctor: true,
      patient: true,
    },
  });

  const newPresDetails = await newPrescription.getAppointment();
  const patient = await newPresDetails.getPatient();
  const doctor = await newPresDetails.getDoctor();

  return {
    prescription: newPrescription,
    doctor,
    patient,
  };
};

module.exports = {
  getDoctorAppointmentsService,
  getDoctorPatientsService,
  createDoctorService,
  searchDoctorsService,
  createPrescriptionByDoctorService,
};
