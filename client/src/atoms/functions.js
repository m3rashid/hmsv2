import { atom } from "recoil";

export const functionState = atom({
  key: "function",
  default: {
    addAppointment: async () => {},
    addNotification: async () => {},
    loadDoctorAppointment: async () => {},
    setAppointmentPendingStatus: async () => {},
    loadPharmacyPrescriptions: async () => {},
    loadInventoryItems: async () => {},
  },
});
