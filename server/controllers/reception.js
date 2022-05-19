export const createReception = (io, socket) => (patientData) => {
  console.log(patientData);
  //   first create the patient in the database
  //
  //

  // emit to all doctors (only) that a new patient has been created
  io.emit(createPatientFromReception, patientData);
};

//  user groups bhi banane hai yrr, auth options ke basis pe :/
