import { atom } from "recoil";

export const adminDefaultState = {
  receptionists: [],
  doctors: [],
  patients: [],
};

export const adminState = atom({
  key: "admin",
  default: adminDefaultState,
});
