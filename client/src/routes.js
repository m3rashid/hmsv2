import Patient from "./pages/Patient";
// import Appointments from "./pages/appointments";
import Admin from "./pages/admin";
import DoctorAppointments from "./pages/doctor/Appointments";
import PrescriptionForm from "./pages/doctor/prescribeMedicine";
import Prescriptions from "./pages/pharmacy/Prescriptions";
import CreateReceipts from "./pages/pharmacy/CreateReceipts";
import CreateAppointmentForm from "./pages/reception/CreateAppointmentForm";
import InventoryDisplay from "./pages/inventory/Display";
import AddNewInventory from "./pages/inventory/New";
import CreatePatientForm from "./pages/reception/CreatePatientForm";

export const checkAccess = (Auth, route) => {
  if (!Auth.isLoggedIn) {
    return false;
  }

  const userType = Auth.user.permissions;
  if (userType === "ADMIN") return true;
  const contains = route.role.some((role) => userType.includes(role));
  return contains;
};

export const permissions = {
  // all access to this special role admin
  ADMIN: "ADMIN",
  DOCTOR_APPOINTMENTS: "DOCTOR_APPOINTMENTS",
  DOCTOR_PRESCRIBE_MEDICINE: "DOCTOR_PRESCRIBE_MEDICINE",
  PHARMACY_PRESCRIPTIONS: "PHARMACY_PRESCRIPTIONS",
  PHARMACY_RECEIPT: "PHARMACY_RECEIPT",
  RECEPTION_ADD_APPOINTMENT: "RECEPTION_ADD_APPOINTMENT",
  RECEPTION_CREATE_PATIENT: "RECEPTION_CREATE_PATIENT",
  INVENTORY_VIEW: "INVENTORY_VIEW",
  INVENTORY_ADD_MEDICINE: "INVENTORY_ADD_MEDICINE",
};

const routes = [
  {
    path: "/admin",
    component: Admin,
    text: "Admin",
    role: ["ADMIN"],
  },
  {
    path: "/doctor/appointments",
    component: DoctorAppointments,
    text: "Doctor Appointents",
    role: [permissions.DOCTOR_APPOINTMENTS],
  },
  {
    path: "/doctor/prescribe-medicine",
    component: PrescriptionForm,
    text: "Prescribe Medicine",
    role: [permissions.DOCTOR_PRESCRIBE_MEDICINE],
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
    role: [permissions.PHARMACY_PRESCRIPTIONS],
  },
  {
    path: "/pharmacy/receipt",
    component: CreateReceipts,
    text: "Create receipts",
    role: [permissions.PHARMACY_RECEIPT],
  },
  {
    path: "/reception/add-appointment",
    component: CreateAppointmentForm,
    text: "Create Appointment",
    role: [permissions.RECEPTION_ADD_APPOINTMENT],
  },
  {
    path: "/appointment/create-patient",
    component: CreatePatientForm,
    text: "Create Patient",
    role: [permissions.RECEPTION_CREATE_PATIENT],
  },
  {
    path: "/inventory/view",
    component: InventoryDisplay,
    text: "View Inventory",
    role: [permissions.INVENTORY_VIEW],
  },
  {
    path: "/inventory/new",
    component: AddNewInventory,
    text: "Add Medicine",
    role: [permissions.INVENTORY_ADD_MEDICINE],
    showInNav: false,
  },
  {
    path: "/patient/:id",
    component: Patient,
    text: "Patient",
    role: [permissions.DOCTOR_APPOINTMENTS],
    showInNav: false,
  },
];

export default routes;
