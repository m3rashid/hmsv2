const express = require("express");

const {
  createAppointment,
  getAppointmentById,
  createPatient,
} = require("../controllers/reception.js");
const { useRoute } = require("../utils/errors.js");
const { checkAuth } = require("../middlewares/auth.js");

const router = express.Router();

router.post("/create-appointment", checkAuth, useRoute(createAppointment));

router.post("/create-patient", checkAuth, useRoute(createPatient));

router.get("/appointment", checkAuth, useRoute(getAppointmentById));

module.exports = {
  router,
};
