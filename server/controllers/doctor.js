import {
  getDoctorAppointmentsService,
  getDoctorPatientsService,
} from "../services/doctor.js";

export const getDoctorAppointments = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== "DOCTOR")
      throw new Error("Unauthorized");

    const { appointments } = await getDoctorAppointmentsService(req.user.id);
    return res.status(200).json({ appointments });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

export const getDoctorPatients = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== "DOCTOR")
      throw new Error("Unauthorized");

    const { patients } = await getDoctorPatientsService(req.user.id);
    return res.status(200).json({ patients });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};
