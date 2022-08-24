const { editPermissionsService, getAllUsersService } = require("./admin");

const {
  loginService,
  logoutService,
  revalidateService,
  signupService,
} = require("./auth.js");

const {
  getDoctorAppointmentsService,
  getDoctorPatientsService,
  createPrescriptionService,
  searchDoctorsService,
  checkMedAvailabilityService,
  referAnotherDoctorAppointmentService,
  updateAppointmentService,
} = require("./doctor.js");

const {
  DeleteInventoryService,
  addDummy,
  addMedicineService,
  editMedicineService,
  getMedicine,
  searchInventoryService,
} = require("./inventory");

const {
  addTest,
  deleteTest,
  editTest,
  getAllTests,
  getTest,
  getTestsByType,
} = require("./lab");

const {
  createPatientService,
  deletePatientService,
  getPatientByIdService,
  searchPatientsService,
} = require("./patient.js");

const {
  dispensePrescriptionService,
  getAllPrescriptionsService,
  getPrescriptionByIdService,
} = require("./pharmacist");

const {
  createAppointmentService,
  getAppointmentByIdService,
} = require("./reception");

module.exports = {
  editPermissionsService,
  getAllUsersService,

  loginService,
  logoutService,
  revalidateService,
  signupService,

  getDoctorAppointmentsService,
  getDoctorPatientsService,
  createPrescriptionService,
  searchDoctorsService,

  DeleteInventoryService,
  addDummy,
  addMedicineService,
  editMedicineService,
  getMedicine,
  searchInventoryService,

  addTest,
  deleteTest,
  editTest,
  getAllTests,
  getTest,
  getTestsByType,

  createPatientService,
  deletePatientService,
  getPatientByIdService,
  searchPatientsService,

  dispensePrescriptionService,
  getAllPrescriptionsService,
  getPrescriptionByIdService,

  createAppointmentService,
  getAppointmentByIdService,
  checkMedAvailabilityService,
  referAnotherDoctorAppointmentService,
  updateAppointmentService,
};
