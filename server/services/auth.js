const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const prisma = require("../utils/prisma");
const { issueJWT, revalidateJWT } = require("../utils/jwt.js");

const UserDetails = async (userId, role) => {
  try {
    switch (role) {
      case "DOCTOR":
        const doctor = await prisma.Doctor.findUnique({
          where: { id: userId },
          include: { auth: false },
        });
        return JSON.parse(
          JSON.stringify(doctor, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );
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

const loginService = async (email, password) => {
  if (!email || !password) throw new Error("No credentials");

  console.log(email, password);

  const user = await prisma.auth.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new Error("Wrong Credentials");

  const userDetails = await UserDetails(user.id, user.role);
  const { token, refreshToken, expires } = issueJWT(user);
  console.log(user, userDetails);
  return {
    user: {
      role: user.role,
      dataValues: user,
    },
    userDetails,
    token,
    refreshToken,
    expires,
  };
};

const signupService = async (email, password, role) => {
  if (!email || !password || !role) {
    throw new Error("No credentials");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("creating user");
  const user = await prisma.Auth.create({
    data: {
      email,
      password: hashedPassword,
      role: role,
    },
  });

  console.log("user created");
  console.log(user);
  return user;
};

const logoutService = async () => {};

const revalidateService = async (refreshToken) => {
  if (!refreshToken) throw new Error("Unauthorized");

  const { valid, expired, payload } = revalidateJWT(refreshToken);

  if (!valid || expired) throw new Error("Unauthorized");
  const payloadid = payload.sub.id;

  const user = await prisma.Auth.findUnique({ where: { id: payloadid } });
  if (!user) throw new Error("Unauthorized");

  const userDetails = await UserDetails(user.id, user.role);

  const { token, expires } = issueJWT(user);
  return {
    user: {
      role: user.role,
      dataValues: user,
    },
    userDetails,
    token,
    expires,
  };
};

const createDummyService = async () => {
  const roles = ["DOCTOR", "RECEPTIONIST", "ADMIN", "PATIENT", "PHARMACIST"];
  const role = roles[Math.floor(Math.random() * roles.length)];
  const sex = ["m", "f", "o"];
  if (role === "PATIENT") {
    const patientData = {
      name: faker.name.findName(),
      age: faker.datatype.number({ min: 18, max: 60 }),
      sex: sex[Math.floor(Math.random() * sex.length)],
      lastVisit: dayjs().toDate(),
      contact: faker.phone.phoneNumber("+91 ##### #####"),
      address: faker.address.city(),
      email: faker.internet.email(),
    };

    await prisma.patient.create({
      data: patientData,
    });
    return;
  }

  const data = {
    email: faker.internet.email(),
    password: await bcrypt.hash("admin123", 10),
    role,
  };

  const user = await prisma.Auth.create({ data });

  const AuthId = user.id;

  const designation = ["MBBS", "MD", "MS", "DNB", "DNB", "DNB"];

  switch (role) {
    case "DOCTOR":
      const doctorData = {
        name: faker.name.findName(),
        designation:
          designation[Math.floor(Math.random() * designation.length)],
        age: faker.datatype.number({ min: 18, max: 60 }),
        address: faker.address.city(),
        contact: faker.phone.phoneNumber("+91 ##### #####"),
        availability: "Yes",
        auth: {
          connect: {
            id: AuthId,
          },
        },
      };

      console.log(doctorData);

      await prisma.Doctor.create({
        data: doctorData,
      });

      break;
    case "RECEPTIONIST":
      const receptionistData = {
        name: faker.name.findName(),
        email: data.email,
        contact: faker.phone.phoneNumber("+91 ##### #####"),
        address: faker.address.city(),
        auth: {
          connect: {
            id: AuthId,
          },
        },
      };

      await prisma.receptionist.create({ data: receptionistData });
      break;
    case "PHARMACIST":
      const pharmacistData = {
        name: faker.name.findName(),
        email: data.email,
        contact: faker.phone.phoneNumber("+91 ##### #####"),
        address: faker.address.city(),
        auth: {
          connect: {
            id: AuthId,
          },
        },
      };

      await prisma.Pharmacist.create({ data: pharmacistData });
      break;
  }
};

module.exports = {
  UserDetails,
  loginService,
  logoutService,
  signupService,
  revalidateService,
  createDummyService,
};
