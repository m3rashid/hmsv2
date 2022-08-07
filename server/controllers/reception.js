const {
  createAppointmentService,
  getAppointmentByIdService,
} = require("../services/reception.js");
const { createPatientService } = require("../services/patient.js");
const createAppointment = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== "RECEPTIONIST")
      throw new Error("Unauthorized");

    const { appointment } = await createAppointmentService(req.body);
    return res.status(200).json({ appointment });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== "RECEPTIONIST")
      throw new Error("Unauthorized");

    const data = await getAppointmentByIdService(req.query.id);
    console.log(data);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

const createPatient = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== "RECEPTIONIST")
      throw new Error("Unauthorized");

    const { patient } = await createPatientService(req.body);
    return res.status(200).json({ patient });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

//  user groups bhi banane hai yrr, auth options ke basis pe :/

module.exports = {
  createAppointment,
  getAppointmentById,
  createPatient,
};
