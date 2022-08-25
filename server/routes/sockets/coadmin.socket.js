const {
  createPatientService,
  deletePatientService,
} = require("../../services");

const createPatient =
  (io, socket) =>
  async ({ name, age, sex, contact, address, email, jamiaId }) => {
    console.log(socket.user);
    const { patient } = await createPatientService(
      {
        name,
        age,
        sex,
        contact,
        email,
        address,
        jamiaId,
      },
      socket?.user?.permissions
    );
    console.log(patient, "New patient created");
    io.emit("new-patient-created", { data: patient });
  };

const deletePatient =
  (io, socket) =>
  async ({ patientId }) => {
    await deletePatientService(patientId);
    io.emit("patient-delete-success", { patientId });
  };

module.exports = {
  createPatient,
  deletePatient,
};