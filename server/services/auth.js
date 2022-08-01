const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const prisma = require("../utils/prisma");
const { issueJWT, revalidateJWT } = require("../utils/jwt.js");

const UserDetails = async (userId, role) => {
  try {
    switch (role) {
      case "DOCTOR":
        const doctor = await prisma.Doctor.findUnique({
          where: { id: userId },
          include: { auth: true },
        });
        return doctor;
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

  const user = await prisma.Auth.findUnique({
    where: { email },
  });
  if (!user) throw new Error("User not found");
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new Error("Wrong Credentials");

  const userDetails = await UserDetails(user.id, user.role);
  const { token, refreshToken, expires } = issueJWT(user);

  return {
    user,
    userDetails,
    token,
    refreshToken,
    expires,
  };
};

const signupService = async (email, password, role, name) => {
  if (!email || !password || !role || !name) {
    throw new Error("No credentials");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("creating user");
  const user = await prisma.Auth.create({
    name,
    email,
    password: hashedPassword,
    role: role,
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
    user,
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
      lastVisit: faker.date.recent(),
      contact: faker.phone.phoneNumber("+91 ##### #####"),
      address: faker.address.city(),
      email: faker.internet.email(),
    };

    await prisma.Patient.create(patientData);
    return;
  }

  const data = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: await bcrypt.hash("admin123", 10),
    role,
  };

  const user = await prisma.Auth.create(data);

  const AuthId = user.id;

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

      await prisma.Doctor.create(doctorData, {
        include: { auth: true },
      });

      break;
    case "RECEPTIONIST":
      const receptionistData = {
        email: data.email,
        contact: faker.phone.phoneNumber("+91 ##### #####"),
        address: faker.address.city(),
        AuthId: AuthId,
      };

      await prisma.Receptionist.create(receptionistData);
      break;
    case "PHARMACIST":
      const pharmacistData = {
        email: data.email,
        contact: faker.phone.phoneNumber("+91 ##### #####"),
        address: faker.address.city(),
        AuthId: AuthId,
      };

      await prisma.Pharmacist.create(pharmacistData);
      break;
  }
};

module.exports = {
  loginService,
  logoutService,
  signupService,
  revalidateService,
  createDummyService,
};
