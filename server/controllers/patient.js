const {
  createPatientService,
  deletePatientService,
  getPatientByIdService,
  searchPatientsService,
  addDummyPatientsService,
} = require('../services');
const { permissions } = require('../utils/constants');

const createDummyPatients = async (req, res) => {
  const count = req.body.count;
  for (let i = 0; i < count; i++) await addDummyPatientsService();
  return res.status(200).json({
    message: 'Dummy patients created',
  });
};

const createPatient = async (req, res) => {
  if (!req.isAuthenticated) throw new Error('Unauthorized');
  if (!req.permissions.includes(permissions.RECEPTION_CREATE_PATIENT)) {
    throw new Error('Unauthorized for this resource');
  }

  const { newPatient } = await createPatientService(...req.body, req.user);

  return res.status(200).json({
    message: 'Patient creation Successful',
    newPatient,
  });
};

const deletePatient = async (req, res) => {
  await deletePatientService({
    patientId: req.params.id,
    doneBy: req.user,
  });

  return res.status(200).json({
    message: 'Patient deletion Successful',
  });
};

const getPatientById = async (req, res) => {
  const { patient } = await getPatientByIdService(req.params.id);

  return res.status(200).json({
    message: 'Patient found',
    patient,
  });
};

const searchPatients = async (req, res) => {
  const { count, patients } = await searchPatientsService(req.query);

  return res.status(200).json({
    message: `${count} patients found`,
    patients,
  });
};

module.exports = {
  createPatient,
  deletePatient,
  getPatientById,
  searchPatients,
  createDummyPatients,
};
