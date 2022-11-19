export const InventoryTypes = {
  Medicine: "Medicine",
  NonMedicine: "NonMedicine",
  OtherAssets: "OtherAssets",
};

export const Category = {
  GENERAL_MEDICINE: "GENERAL_MEDICINE",
  CARDIOLOGY: "CARDIOLOGY",
  DERMATOLOGY: "DERMATOLOGY",
  INTERNAL_MEDICINE: "INTERNAL_MEDICINE",
  OPHTHALMOLOGY: "OPHTHALMOLOGY",
  ENT: "ENT",
  GYNAECOLOGY: "GYNAECOLOGY",
};

export const MedType = {
  TABLET: "TABLET",
  SYRUP: "SYRUP",
};

export const dosages = [
  { value: "OD", label: "Once a day" },
  { value: "BD", label: "Twice a day" },
  { value: "TD", label: "Three times a day" },
  { value: "QD", label: "Four times a day" },
  { value: "OW", label: "Once a week" },
  { value: "BW", label: "Twice a week" },
  { value: "TW", label: "Three times a week" },
];

export const supportedUserRoles = [
  "DOCTOR",
  "ADMIN",
  "RECEPTIONIST",
  "PHARMACIST",
  "INVENTORY_MANAGER",
  "CO_ADMIN",
  "OTHER",
];

export const allPermissions = {
  ADMIN: "ADMIN",
  DOCTOR_APPOINTMENTS: "DOCTOR_APPOINTMENTS",
  DOCTOR_PRESCRIBE_MEDICINE: "DOCTOR_PRESCRIBE_MEDICINE",
  PHARMACY_PRESCRIPTIONS: "PHARMACY_PRESCRIPTIONS",
  PHARMACY_RECEIPT: "PHARMACY_RECEIPT",
  RECEPTION_ADD_APPOINTMENT: "RECEPTION_ADD_APPOINTMENT",
  RECEPTION_CREATE_PATIENT: "RECEPTION_CREATE_PATIENT",
  INVENTORY_VIEW: "INVENTORY_VIEW",
  INVENTORY_ADD_MEDICINE: "INVENTORY_ADD_MEDICINE",
  EDIT_USER_PROFILE: "EDIT_USER_PROFILE",
  EDIT_USER_PERMISSIONS: "EDIT_USER_PERMISSIONS",
  GET_ALL_USERS: "GET_ALL_USERS",
};

export const Days = {
  SUN: "SUN",
  MON: "MON",
  TUE: "TUE",
  WED: "WED",
  THU: "THU",
  FRI: "FRI",
  SAT: "SAT",
};

export const backToRealDays = {
  SUN: "SUNDAY",
  MON: "MONDAY",
  TUE: "TUESDAY",
  WED: "WEDNESDAY",
  THU: "THURSDAY",
  FRI: "FRIDAY",
  SAT: "SATURDAY",
};

export const PatientTypeEnum = {
  EMPLOYEE: "EMPLOYEE",
  STUDENT: "STUDENT",
  PENSIONER: "PENSIONER",
  FAMILY_PENSIONER: "FAMILY_PENSIONER",
  DEPENDANT: "DEPENDANT"
}
