const {
  editPermissions,
  getAllUsers,
  updateUser,
  generateHmsReports,
  reportDetails,
  getSinglePatientDetails,
} = require('../controllers/admin');

const { login, revalidate, signup } = require('../controllers/auth');

const {
  getDoctorAppointments,
  getDoctorPatients,
  checkMedAvailability,
  createPrescriptionByDoctor,
  getAppointmentById,
  referAnotherDoctor,
  searchDoctors,
  makeDoctorLeave,
} = require('../controllers/doctor');

const {
  CreateDummyInventory,
  DeleteInventory,
  EditInventory,
  SearchMedicines,
  addMedicine,
} = require('../controllers/inventory');

const {
  createPatient,
  deletePatient,
  getPatientById,
  searchPatients,
  createDummyPatients,
} = require('../controllers/patient');

const {
  dispensePrescription,
  getAllPrescriptions,
  getPrescriptionById,
} = require('../controllers/pharmacist');

const { createAppointment } = require('../controllers/reception');

const { handleDataMigration } = require('./dataMigration');

module.exports = {
  editPermissions,
  getAllUsers,
  updateUser,
  generateHmsReports,
  reportDetails,
  getSinglePatientDetails,

  login,
  revalidate,
  signup,

  getDoctorAppointments,
  getDoctorPatients,
  checkMedAvailability,
  createPrescriptionByDoctor,
  getAppointmentById,
  referAnotherDoctor,
  searchDoctors,
  makeDoctorLeave,

  CreateDummyInventory,
  DeleteInventory,
  EditInventory,
  SearchMedicines,
  addMedicine,

  createPatient,
  deletePatient,
  getPatientById,
  searchPatients,
  createDummyPatients,

  dispensePrescription,
  getAllPrescriptions,
  getPrescriptionById,

  createAppointment,

  handleDataMigration,
};
