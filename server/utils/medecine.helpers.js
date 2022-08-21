const { dosages } = require("./constants");
const quantityCalculator = (duration, dosage) =>
  Math.ceil(duration * dosages[dosage]);

module.exports = {
  quantityCalculator,
};
