import { atom } from "recoil";
import { InventoryTypes } from "../utils/constants";

const inventoryDefaultState = {
  [InventoryTypes.Medicine]: [],
  [InventoryTypes.NonMedicine]: [],
  [InventoryTypes.OtherAssets]: [],
};

export const inventoryState = atom({
  key: "inventory",
  default: inventoryDefaultState,
});
