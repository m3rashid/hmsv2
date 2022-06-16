export const socketConstants = {
  receptionistLeft: "receptionist-left",
  doctorLeft: "doctor-left",
  pharmacistLeft: "pharmacist-left",
  createUser: "create-user",
  getDoctorAppointments: "get-doctor-appointments",
  getDoctorPatients: "get-doctor-patients",
  createPatient: "create-patient",
  deletePatient: "delete-patient",
  getPatientById: "get-patient-by-id",
  searchPatients: "search-patients",
  createReceptionist: "create-receptionist",
  createAppointment: "create-appointment",
  createPrescriptionByDoctor: "create-prescription-by-doctor",

  // not handled
  foundDoctorAppointments: "found-doctor-appointments",
  foundDoctorPatients: "found-doctor-patients",
  newPatientCreated: "new-patient-created",
  patientDeleteSuccess: "patient-delete-success",
  patientFound: "patient-found",

  // left
  receptionistLeft: "receptionist-left",
  doctorLeft: "doctor-left",
  pharmacistLeft: "pharmacist-left",
};

import {
  createAppointment,
  createPatient,
  createReceptionist,
  createUser,
  deletePatient,
  doctorLeft,
  getDoctorAppointments,
  getDoctorPatients,
  getPatientById,
  pharmacistLeft,
  receptionistLeft,
  searchPatients,
  createPrescriptionByDoctor,
} from "./handlers.js";

const socketHandler = (io, socket) => {
  socket.on(socketConstants.receptionistLeft, receptionistLeft(io, socket));
  socket.on(socketConstants.doctorLeft, doctorLeft(io, socket));
  socket.on(socketConstants.pharmacistLeft, pharmacistLeft(io, socket));
  socket.on(socketConstants.createUser, createUser(io, socket));
  socket.on(
    socketConstants.getDoctorAppointments,
    getDoctorAppointments(io, socket)
  );
  socket.on(socketConstants.getDoctorPatients, getDoctorPatients(io, socket));
  socket.on(socketConstants.createPatient, createPatient(io, socket));
  socket.on(socketConstants.deletePatient, deletePatient(io, socket));
  socket.on(socketConstants.getPatientById, getPatientById(io, socket));
  socket.on(socketConstants.searchPatients, searchPatients(io, socket));
  socket.on(socketConstants.createReceptionist, createReceptionist(io, socket));
  socket.on(socketConstants.createAppointment, createAppointment(io, socket));
  socket.on(
    socketConstants.createPrescriptionByDoctor,
    createPrescriptionByDoctor(io, socket)
  );
};

export default socketHandler;
