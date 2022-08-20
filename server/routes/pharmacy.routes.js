const express = require("express");

const { checkAuth } = require("../middlewares/auth");
const {dispensePrescription,getAllPrescriptions } = require("../controllers/pharmacist");

const router = express.Router();

router.get("/prescriptions", checkAuth, getAllPrescriptions);
router.post("/dispense", checkAuth, dispensePrescription);

module.exports = {
  router,
};
