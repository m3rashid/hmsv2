import { DOSAGE_MAP } from "./dosage_map";

export const getEstimatedMedRequirement = ({ duration, dosage, medType }) => {
  let requiredQuantity = Math.ceil(duration * DOSAGE_MAP[dosage]);

  return requiredQuantity;
};
