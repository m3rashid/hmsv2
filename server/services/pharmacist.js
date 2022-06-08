// import { Op } from "sequelize";
// import db from "../models/index.js";
// import { UserDetails } from "./auth.js";

// export const getDoctorAppointmentsService = async (userId) => {
//   const Doc = await UserDetails(userId, "DOCTOR");
//   const appointments = await db.Appointment.findAll({
//     where: {
//       DoctorId: Doc.id,
//     },
//     include: [
//       {
//         model: db.Doctor,
//         as: "Doctor",
//       },
//       {
//         model: db.Patient,
//         as: "Patient",
//       },
//     ],
//     order: [["date", "DESC"]],
//   });

//   console.log(appointments);
//   return { appointments };
// };

// export const getDoctorPatientsService = async (doctorId) => {
//   const patients = await db.Patient.findAll({
//     where: {},
//   });
//   return { patients };
// };

// export const createDoctorService = async (doctor) => {
//   try {
//     const newDoctor = await db.Doctor.create(doctor);
//     return { newDoctor };
//   } catch (err) {
//     console.log(err);
//     return new Error("Internal Server Error");
//   }
// };

// export const searchDoctorsService = async ({
//   name,
//   minAge,
//   maxAge,
//   designation,
//   contact,
//   email,
//   address,
// }) => {
//   const whereClause = {};
//   if (name) {
//     whereClause.name = { [Op.like]: `%${name}%` };
//   }
//   if (minAge) {
//     whereClause.age = { [Op.gte]: minAge };
//   }
//   if (maxAge) {
//     whereClause.age = { [Op.lte]: maxAge };
//   }

//   if (designation) {
//     whereClause.designation = { [Op.like]: designation };
//   }

//   if (contact) {
//     whereClause.contact = { [Op.like]: `%${contact}%` };
//   }
//   if (address) {
//     whereClause.address = { [Op.like]: `%${address}%` };
//   }
//   if (email) {
//     whereClause.email = { [Op.like]: `%${email}%` };
//   }

//   console.log(whereClause);

//   const doctors = await db.Doctor.findAll({
//     where: {
//       [Op.or]: whereClause,
//     },
//     raw: true,
//   });

//   console.log(doctors);
//   return { count: doctors.length, doctors };
// };
