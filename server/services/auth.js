import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import db from "../models/index.js";
import { issueJWT, revalidateJWT } from "../utils/jwt.js";

export const UserDetails = async (userId, role) => {
  console.log(userId, role);
  try {
    switch (role) {
      case "DOCTOR":
        const doctor = await db.Doctor.findOne(
          {
            where: {
              AuthId: userId,
            },
          },
          {
            include: [
              {
                model: db.Auth,
                as: "Auth",
              },
            ],
            raw: true,
          }
        );
        console.log(doctor);
        return {
          ...doctor.dataValues,
          id: doctor.dataValues.id,
        };
      case "PATIENT":
        return null;
      default:
        return null;
    }
  } catch (err) {
    console.log(err);
    return new Error("Internal Server Error");
  }
};

export const loginService = async (email, password) => {
  if (!email || !password) throw new Error("No credentials");

  const user = await db.Auth.findOne({
    where: {
      email,
    },
  });
  if (!user) throw new Error("User not found");
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new Error("Wrong Credentials");

  console.log(user);
  const { id, role } = user.dataValues;

  const userDetails = await UserDetails(id, role);

  const { token, refreshToken, expires } = issueJWT(user);

  return {
    user,
    userDetails,
    token,
    refreshToken,
    expires,
  };
};

export const signupService = async (email, password, role, name) => {
  if (!email || !password || !role || !name) {
    throw new Error("No credentials");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("creating user");
  const user = await db.Auth.create({
    name,
    email,
    password: hashedPassword,
    role: role,
  });

  console.log("user created");
  console.log(user);
  return user;
};

export const logoutService = async () => {};

export const revalidateService = async (refreshToken) => {
  if (!refreshToken) throw new Error("Unauthorized");

  const { valid, expired, payload } = revalidateJWT(refreshToken);

  if (!valid || expired) throw new Error("Unauthorized");
  const payloadid = payload.sub.id;

  const user = await db.Auth.findOne({ where: { id: payloadid } });
  if (!user) throw new Error("Unauthorized");

  const { id, role } = user.dataValues;

  const userDetails = await UserDetails(id, role);

  const { token, expires } = issueJWT(user);
  return { user, userDetails, token, expires };
};

export const createDummyService = async () => {
  const roles = ["DOCTOR", "RECEPTIONIST", "ADMIN", "PATIENT"];
  const role = roles[Math.floor(Math.random() * roles.length)];
  const sex = ["m", "f", "o"];
  if (role === "PATIENT") {
    const patientData = {
      name: faker.name.findName(),
      age: faker.datatype.number({ min: 18, max: 60 }),
      sex: sex[Math.floor(Math.random() * sex.length)],
      lastVisit: faker.date.recent(),
      contact: faker.phone.phoneNumber("+91 ##### #####"),
      address: faker.address.city(),
      email: faker.internet.email(),
    };

    await db.Patient.create(patientData);
    return;
  }

  const data = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: await bcrypt.hash("admin123", 10),
    role,
  };

  const user = await db.Auth.create(data);

  const AuthId = user.dataValues.id;

  const designation = ["MBBS", "MD", "MS", "DNB", "DNB", "DNB"];

  switch (role) {
    case "DOCTOR":
      const doctorData = {
        name: data.name,
        email: data.email,
        designation:
          designation[Math.floor(Math.random() * designation.length)],
        age: faker.datatype.number({ min: 18, max: 60 }),
        address: faker.address.city(),
        contact: faker.phone.phoneNumber("+91 ##### #####"),
        availability: faker.datatype.boolean(),
        AuthId: AuthId,
      };

      await db.Doctor.create(doctorData, {
        include: [
          {
            model: db.Auth,
            as: "Auth",
          },
        ],
      });

      break;
    case "RECEPTIONIST":
      const receptionistData = {
        email: data.email,
        contact: faker.phone.phoneNumber("+91 ##### #####"),
        address: faker.address.city(),
        AuthId: AuthId,
      };

      await db.Receptionist.create(receptionistData);
  }
};
