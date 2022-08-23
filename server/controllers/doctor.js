const { faker } = require("@faker-js/faker");

const {
  getDoctorAppointmentsService,
  getDoctorPatientsService,
  searchDoctorsService,
  createPrescriptionByDoctorService,
  referAnotherDoctorAppointmentService,
  checkMedAvailabilityService,
} = require("../services/doctor.js");
const prisma = require("../utils/prisma");
const { getAppointmentByIdService } = require("../services/reception.js");

const getDoctorAppointments = async (req, res) => {
  if (!req.user || !req.user.id) throw new Error("Unauthorized");
  const { appointments } = await getDoctorAppointmentsService(req.user.id);

  return res.status(200).json({
    appointments,
  });
};

const getAppointmentById = async (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== "DOCTOR") {
    throw new Error("Unauthorized");
  }

  const data = await getAppointmentByIdService(req.query.id);
  console.log(data);
  return res.status(200).json(data);
};

const getDoctorPatients = async (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== "DOCTOR") {
    throw new Error("Unauthorized");
  }

  const { patients } = await getDoctorPatientsService(req.user.id);
  return res.status(200).json({
    patients,
  });
};

const searchDoctors = async (req, res) => {
  const { count, doctors } = await searchDoctorsService(req.query);

  return res.status(200).json({
    message: `${count} doctors found`,
    doctors,
  });
};

const FillDummy = async (req, res) => {
  const count = req.body.count;
  const designations = ["MBBS", "MD", "MS", "DNB", "BDS", "BHMS", "BAMS"];
  for (let i = 0; i < count; i++) {
    const info = {
      name: faker.name.findName(),
      availability: faker.datatype.boolean(),
      age: faker.datatype.number({ min: 18, max: 60 }),
      designation:
        designations[
          faker.datatype.number({ min: 0, max: designations.length - 1 })
        ],
      contact: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
    };

    await prisma.Doctor.create(info);
  }

  return res.status(200).json({
    message: `${count} patients created`,
  });
};

const createPrescriptionByDoctor = async (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== "DOCTOR") {
    throw new Error("Unauthorized");
  }

  const { appointment, symptoms, diagnosis, customMedicines, datetime } =
    req.body;

  const { prescription: newPrescription } =
    await createPrescriptionByDoctorService({
      appointment,
      symptoms,
      diagnosis,
      customMedicines,
      datetime,
    });

  return res.status(200).json({
    newPrescription,
  });
};

const referAnotherDoctor = async (req, res) => {
  const appointment = await referAnotherDoctorAppointmentService({
    patientId: req.body.patientId,
    prevDoctorId: req.body.prevDoctorId,
    nextDoctorId: req.body.nextDoctorId,
    date: req.body.date,
    remarks: req.body.remarks,
  });

  return res.status(200).json({
    appointment,
  });
};

const checkMedAvailability = async (req, res) => {
  const { dosage, medicineId, duration } = req.body;

  const data = await checkMedAvailabilityService({
    dosage,
    medicineId,
    duration,
  });

  console.log(data);
  return res.status(200).json(data);
};

module.exports = {
  FillDummy,
  searchDoctors,
  getDoctorPatients,
  referAnotherDoctor,
  getAppointmentById,
  getDoctorAppointments,
  createPrescriptionByDoctor,
  checkMedAvailability,
};
