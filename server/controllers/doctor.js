import {
  getDoctorAppointmentsService,
  getDoctorPatientsService,
  searchDoctorsService,
} from "../services/doctor.js";
import { faker } from "@faker-js/faker";
import db from "../models/index.js";
import { getAppointmentByIdService } from "../services/reception.js";

export const getDoctorAppointments = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== "DOCTOR")
      throw new Error("Unauthorized");

    const { appointments } = await getDoctorAppointmentsService(req.user.id);
    return res.status(200).json({ appointments });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== "DOCTOR")
      throw new Error("Unauthorized");

    // console.log(req.query);

    const data = await getAppointmentByIdService(req.query.id);
    console.log(data);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

export const getDoctorPatients = async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== "DOCTOR")
      throw new Error("Unauthorized");

    const { patients } = await getDoctorPatientsService(req.user.id);
    return res.status(200).json({ patients });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

export const searchDoctors = async (req, res) => {
  try {
    const { count, doctors } = await searchDoctorsService(req.query);
    return res.status(200).json({
      message: `${count} doctors found`,
      doctors,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

export const FillDummy = async (req, res) => {
  try {
    const count = req.body.count;
    const designations = ["MBBS", "MD", "MS", "DNB", "BDS", "BHMS", "BAMS"];
    for (let i = 0; i < count; i++) {
      const info = {
        name: faker.name.findName(),
        availability: faker.datatype.boolean(),
        age: faker.datatype.number({ min: 18, max: 60 }),
        designation:
          designations[
            faker.datatype.number({ min: 0, max: designations.length - 1 })
          ],
        contact: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        address: faker.address.streetAddress(),
      };

      await db.Doctor.create(info);
    }

    return res.status(200).json({
      message: `${count} patients created`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};
