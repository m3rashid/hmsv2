const {
  editPermissionsService,
  getAllUsersService,
  generateReportsService,
  updateUserProfileService,
  getReportDetailsService,
  getSinglePatientDetailsService,
} = require('../services/admin');

const {
  loginService,
  logoutService,
  revalidateService,
  signupService,
} = require('../services/auth');

const {
  getDoctorAppointmentsService,
  getDoctorPatientsService,
  createPrescriptionService,
  searchDoctorsService,
  checkMedAvailabilityService,
  referAnotherDoctorAppointmentService,
  updateAppointmentService,
  getPrescriptionByAppointmentService,
} = require('../services/doctor');

const {
  DeleteInventoryService,
  addDummy,
  addMedicineService,
  editMedicineService,
  getMedicine,
  searchInventoryService,
} = require('../services/inventory');

const {
  addTest,
  deleteTest,
  editTest,
  getAllTests,
  getTest,
  getTestsByType,
} = require('../services/lab');

const {
  createPatientService,
  deletePatientService,
  getPatientByIdService,
  searchPatientsService,
  addDummyPatientsService,
} = require('../services/patient');

const {
  dispensePrescriptionService,
  getAllPrescriptionsService,
  getPrescriptionByIdService,
} = require('../services/pharmacist');

const { createAppointmentService, getAppointmentByIdService } = require('../services/reception');

module.exports = {
  editPermissionsService,
  getAllUsersService,
  generateReportsService,
  updateUserProfileService,
  getReportDetailsService,
  getSinglePatientDetailsService,

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
  addDummyPatientsService,

  dispensePrescriptionService,
  getAllPrescriptionsService,
  getPrescriptionByIdService,

  createAppointmentService,
  getAppointmentByIdService,
  checkMedAvailabilityService,
  referAnotherDoctorAppointmentService,
  getPrescriptionByAppointmentService,
  updateAppointmentService,
};
