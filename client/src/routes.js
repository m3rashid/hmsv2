import Doctor from "./pages/doctor";
import Patient from "./pages/patient";
import Pharmacy from "./pages/pharmacy";
import Reception from "./pages/reception";
import Appointments from "./pages/appointments";
import Admin from "./pages/admin";

export const validateRoute = (Auth, route) => {
  console.log(Auth);
  if (!Auth.isLoggedIn) {
    return false;
  }

  const userType = Auth.user.role;
  console.log(userType);
  if (userType === "ADMIN") {
    return true;
  } else if (!route.role.includes(userType)) {
    return false;
  } else {
    return true;
  }
};

const routes = [
  {
    path: "/admin",
    component: Admin,
    text: "Admin",
    role: [],
  },
  {
    path: "/doctor",
    component: Doctor,
    text: "Doctor",
    role: ["DOCTOR"],
  },
  {
    path: "/patient",
    component: Patient,
    text: "Patient",
    role: ["PATIENT"],
  },
  {
    path: "/pharmacy",
    component: Pharmacy,
    text: "Pharmacy",
    role: ["PHARMACY"],
  },
  {
    path: "/reception",
    component: Reception,
    text: "Reception",
    role: ["RECEPTIONIST"],
  },
  {
    path: "/appointments",
    component: Appointments,
    text: "Appointments",
    role: ["RECEPTIONIST"],
  },
];

export default routes;
