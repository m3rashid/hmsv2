import Patient from "./pages/Patient";

import {
  Home as AdminHome,
  Receptionists,
  Doctors,
  Patients,
  Pharmacists,
  InventoryManagers,
  CoAdmins,
  Others,
  LogReports,
} from "./pages/admin";
import {
  Medicines,
  NonMedicines,
  OtherAssets,
} from "./pages/inventory/Display";
import AddNewInventory from "./pages/inventory/New";
import Prescriptions from "./pages/pharmacy/Prescriptions";
import DoctorAppointments from "./pages/doctor/Appointments";
import CreateReceipts from "./pages/pharmacy/CreateReceipts";
import PrescriptionForm from "./pages/doctor/PrescribeMedicine";
import CreatePatientForm from "./pages/reception/CreatePatientForm";
import CreateAppointmentForm from "./pages/reception/CreateAppointmentForm";

import { allPermissions } from "./utils/constants";
import ProfilePage from "./pages/profile";

export const checkAccess = (Auth, route) => {
  if (!Auth.isLoggedIn) {
    return false;
  }

  const userType = Auth.user.permissions;
  if (route.role.includes("*")) return true;
  if (userType === "ADMIN") return true;
  const contains = route.role.some((role) => userType.includes(role));
  return contains;
};

const routes = [
  {
    path: "/admin/home",
    component: AdminHome,
    text: "Admin Home",
    role: ["ADMIN"],
  },
  {
    path: "/admin/receptionists",
    component: Receptionists,
    text: "Receptionists",
    role: ["ADMIN"],
  },
  {
    path: "/admin/doctors",
    component: Doctors,
    text: "Doctors",
    role: ["ADMIN"],
  },
  {
    path: "/admin/pharmacists",
    component: Pharmacists,
    text: "Pharmacists",
    role: ["ADMIN"],
  },
  {
    path: "/admin/inventory-managers",
    component: InventoryManagers,
    text: "Inventory-Managers",
    role: ["ADMIN"],
  },
  {
    path: "/admin/co-admins",
    component: CoAdmins,
    text: "Co-Admins",
    role: ["ADMIN"],
  },
  {
    path: "/admin/others",
    component: Others,
    text: "Others",
    role: ["ADMIN"],
  },
  {
    path: "/admin/patients",
    component: Patients,
    text: "Patients",
    role: ["ADMIN"],
  },
  {
    path: "/admin/log-reports",
    component: LogReports,
    text: "Log Reports",
    role: ["ADMIN"],
  },
  {
    path: "/reception/add-appointment",
    component: CreateAppointmentForm,
    text: "Create Appointment",
    role: [allPermissions.RECEPTION_ADD_APPOINTMENT],
  },
  {
    path: "/doctor/appointments",
    component: DoctorAppointments,
    text: "Doctor Appointents",
    role: [allPermissions.DOCTOR_APPOINTMENTS],
  },
  {
    path: "/doctor/prescribe-medicine",
    component: PrescriptionForm,
    text: "Prescribe Medicine",
    role: [allPermissions.DOCTOR_PRESCRIBE_MEDICINE],
  },
  {
    path: "/patient",
    component: Patient,
    text: "Patient",
    role: ["PATIENT"],
  },
  {
    path: "/pharmacy/prescriptions",
    component: Prescriptions,
    text: "Pharmacy",
    role: [allPermissions.PHARMACY_PRESCRIPTIONS],
  },
  {
    path: "/pharmacy/receipt",
    component: CreateReceipts,
    text: "Create receipts",
    role: [allPermissions.PHARMACY_RECEIPT],
  },
  {
    path: "/appointment/create-patient",
    component: CreatePatientForm,
    text: "Create Patient",
    role: [allPermissions.RECEPTION_CREATE_PATIENT],
  },
  {
    path: "/inventory/new",
    component: AddNewInventory,
    text: "Add to Inventory",
    role: [allPermissions.INVENTORY_ADD_MEDICINE],
  },
  {
    path: "/inventory/medicines",
    component: Medicines,
    text: "View Medicines",
    role: [allPermissions.INVENTORY_VIEW],
  },
  {
    path: "/inventory/non-medicines",
    component: NonMedicines,
    text: "View Non Medicines",
    role: [allPermissions.INVENTORY_VIEW],
  },
  {
    path: "/inventory/other-assets",
    component: OtherAssets,
    text: "View Other Assets",
    role: [allPermissions.INVENTORY_VIEW],
  },
  {
    path: "/patient/:id",
    component: Patient,
    text: "Patient",
    role: [allPermissions.DOCTOR_APPOINTMENTS],
    showInNav: false,
  },
  {
    path: "/me",
    component: ProfilePage,
    text: "My Profile",
    role: ["*"],
  },
];

export default routes;
