const express = require("express");

const {
  searchDoctors,
  getDoctorPatients,
  referAnotherDoctor,
  getAppointmentById,
  getDoctorAppointments,
  createPrescriptionByDoctor,
  checkMedAvailability,
} = require("../controllers");
const { useRoute } = require("../utils/errors.js");
const { checkAuth } = require("../middlewares/auth.js");
const { GetPrescriptionByAppointmentID } = require("../controllers/doctor");

const router = express.Router();

router.get("/get-appointments", checkAuth, useRoute(getDoctorAppointments));

router.get("/getappointmentbyId", checkAuth, useRoute(getAppointmentById));

router.get("/search", checkAuth, useRoute(searchDoctors));

router.post(
  "/create-prescription",
  checkAuth,
  useRoute(createPrescriptionByDoctor)
);

router.get("/get-patients", checkAuth, useRoute(getDoctorPatients));

router.post("/refer", checkAuth, useRoute(referAnotherDoctor));

router.post(
  "/med/check-availability",
  checkAuth,
  useRoute(checkMedAvailability)
);

router.get("/appointment-prescription/:id", GetPrescriptionByAppointmentID);

module.exports = {
  router,
};
