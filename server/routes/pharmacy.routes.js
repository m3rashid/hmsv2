const express = require("express");

const { checkAuth } = require("../middlewares/auth");
const {dispensePrescription,getAllPrescriptions, getPrescriptionById} = require("../controllers/pharmacist");

const router = express.Router();

router.get("/prescriptions", checkAuth, getAllPrescriptions);
router.post("/dispense", checkAuth, dispensePrescription);
router.get("/prescriptions/:id", checkAuth, getPrescriptionById);

module.exports = {
  router,
};
