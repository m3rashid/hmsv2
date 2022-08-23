const { dispensePrescriptionService } = require("../../services");

const pharmacistLeft =
  (io, socket) =>
  ({ pharmacistId }) => {
    try {
      io.emit("pharmacist-left", { pharmacistId });
    } catch (err) {
      console.log(err);
      io.emit("error", {
        message: err.message || "An error occured",
      });
    }
  };

const dispensePrescription =
  (io, socket) =>
  async ({ prescriptionId, medicines }) => {
    console.log(prescriptionId, medicines);
    try {
      const data = await dispensePrescriptionService({
        prescriptionId,
        medicines,
      });
      io.emit("prescription-dispensed", { data });
    } catch (err) {
      console.log(err);
      io.emit("error", {
        message: err.message || "An error occured",
      });
    }
  };

module.exports = {
  pharmacistLeft,
  dispensePrescription,
};
