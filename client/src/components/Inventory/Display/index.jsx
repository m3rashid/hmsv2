import React from "react";
import { InventoryTypes } from "../../../utils/constants";
import InventoryTable from "./components/InventoryTable";
import InventoryWrapper from "./inventoryWrapper";

export const Medicines = () => (
  <InventoryWrapper>
    <InventoryTable type={InventoryTypes.Medicine} />
  </InventoryWrapper>
);

export const NonMedicines = () => (
  <InventoryWrapper>
    <InventoryTable type={InventoryTypes.NonMedicine} />
  </InventoryWrapper>
);

export const OtherAssets = () => (
  <InventoryWrapper>
    <InventoryTable type={InventoryTypes.OtherAssets} />
  </InventoryWrapper>
);
