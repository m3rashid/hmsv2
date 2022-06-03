import {
  createPatientService,
  deletePatientService,
  getPatientByIdService,
  searchPatientsService,
} from "../services/patient.js";

export const createPatient = async (req, res) => {
  try {
    const { newPatient } = await createPatientService(...req.body);
    return res.status(200).json({
      message: "Patient creation Successful",
      newPatient,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Internal server error",
      err,
    });
  }
};

export const deletePatient = async (req, res) => {
  try {
    await deletePatientService(req.params.id);
    return res.status(200).json({
      message: "Patient deletion Successful",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Internal server error",
      err,
    });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { patient } = await getPatientByIdService(req.params.id);
    return res.status(200).json({
      message: "Patient found",
      patient,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Internal server error",
      err,
    });
  }
};

export const searchPatients = async (req, res) => {
  try {
    console.log(req.query);
    const { count, patients } = await searchPatientsService(req.query);
    return res.status(200).json({
      message: `${count} patients found`,
      patients,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal server error",
      err,
    });
  }
};
