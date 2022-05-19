import { createUserService } from "../../services/index.js";

export const createUser =
  (io, socket) =>
  async ({ email, password, role, name }) => {
    try {
      const { user } = await createUserService(email, password, role, name);
      console.log(user);
      // emit that user was  created successfully
    } catch (err) {
      console.log(err);
      io.emit("error", {
        message: err.message || "An error occured",
      });
    }
  };

export const getDoctorAppointments =
  (io, socket) =>
  async ({ doctorId }) => {
    try {
      const { appointments } = await getDoctorAppointmentsService(doctorId);
      io.emit("found-doctor-appointments", {
        doctorId,
        appointments,
      });
    } catch (err) {
      console.log(err);
      io.emit("error", {
        message: err.message || "An error occured",
      });
    }
  };

export const getDoctorPatients =
  (io, socket) =>
  async ({ doctorId }) => {
    try {
      const { patients } = await getDoctorPatientsService(doctorId);
      io.emit("found-doctor-patients", {
        doctorId,
        patients,
      });
    } catch (err) {
      console.log(err);
      io.emit("error", {
        message: err.message || "An error occured",
      });
    }
  };

export const createPatient =
  (io, socket) =>
  async ({ name, age, sex, contact, address, email, jamiaId }) => {
    try {
      const { newPatient } = await createPatientService(
        name,
        age,
        sex,
        contact,
        address,
        email,
        jamiaId
      );
      io.emit("new-patient-created", { newPatient });
    } catch (err) {
      console.log(err);
      io.emit("error", {
        message: err.message || "An error occured",
      });
    }
  };

export const deletePatient =
  (io, socket) =>
  async ({ patientId }) => {
    try {
      await deletePatientService(patientId);
      io.emit("patient-delete-success", { patientId });
    } catch (err) {
      console.log(err);
      io.emit("error", {
        message: err.message || "An error occured",
      });
    }
  };

export const getPatientById =
  (io, socket) =>
  async ({ patientId }) => {
    try {
      const { patient } = await getPatientByIdService(patientId);
      io.emit("patient-found", {
        patientId,
        patient,
      });
    } catch (err) {
      console.log(err);
      io.emit("error", {
        message: err.message || "An error occured",
      });
    }
  };

export const searchPatients =
  (io, socket) =>
  async ({
    name,
    minAge,
    maxAge,
    sex,
    contact,
    address,
    email,
    jamiaId,
    lastVisitedBefore,
    lastVisitedAfter,
  }) => {
    try {
      const { count, patients } = await searchPatientsService(
        name,
        minAge,
        maxAge,
        sex,
        contact,
        address,
        email,
        jamiaId,
        lastVisitedBefore,
        lastVisitedAfter
      );
      io.emit("patients-found", {
        count,
        patients,
      });
    } catch (err) {
      console.log(err);
      io.emit("error", {
        message: err.message || "An error occured",
      });
    }
  };

export const createReceptionist = (io, socket) => () => {
  try {
  } catch (err) {
    console.log(err);
    io.emit("error", {
      message: err.message || "An error occured",
    });
  }
};

export const receptionistLeft =
  (io, socket) =>
  ({ receptionistId }) => {
    try {
      io.emit("receptionist-left", { receptionistId });
    } catch (err) {
      console.log(err);
      io.emit("error", {
        message: err.message || "An error occured",
      });
    }
  };

export const doctorLeft =
  (io, socket) =>
  ({ doctorId }) => {
    try {
      io.emit("doctor-left", { doctorId });
    } catch (err) {
      console.log(err);
      io.emit("error", {
        message: err.message || "An error occured",
      });
    }
  };

export const pharmacistLeft =
  (io, socket) =>
  ({ pharmacistId }) => {
    try {
      io.emit("pharmacist-left", { pharmacistId });
    } catch (err) {
      console.log(err);
      io.emit("error", {
        message: err.message || "An error occured",
      });
    }
  };