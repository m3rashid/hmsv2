import { atom } from "recoil";

export const doctorDefaultState = {
  appointments: [],
  list: [],
  loading: false,
};

export const doctorState = atom({
  key: "doctor",
  default: doctorDefaultState,
});
