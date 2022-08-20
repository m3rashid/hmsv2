export const quantityCalculator = (duration, dosage) => {
  const dosages = {
    OD: 1,
    BD: 2,
    TD: 3,
    QD: 4,
    OW: 1 / 7,
    BW: 2 / 7,
    TW: 3 / 7,
  };

  return Math.ceil(duration * dosages[dosage]);
};
