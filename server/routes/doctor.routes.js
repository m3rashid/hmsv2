import express from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
  getDoctorAppointments,
  getDoctorPatients,
  searchDoctors,
  FillDummy,
} from "../controllers/doctor.js";
const router = express.Router();

router.get("/get-appointments", checkAuth, getDoctorAppointments);
router.get("/search", searchDoctors);
router.post("/dummy", FillDummy);

router.post("/get-patients", checkAuth, getDoctorPatients);

export default router;
