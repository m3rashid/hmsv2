const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

const prisma = require("../utils/prisma");
const { permissions } = require("../utils/auth.helpers");
const { issueJWT, revalidateJWT } = require("../utils/jwt.js");

const allowedRoles = [
  "DOCTOR",
  "ADMIN",
  "RECEPTIONIST",
  "PHARMACIST",
  "INVENTORY_MANAGER",
  "CO_ADMIN",
  "OTHER",
];

const addActions = (role) => {
  let allowedActions = [];
  switch (role) {
    case "DOCTOR":
      allowedActions = [
        permissions.DOCTOR_APPOINTMENTS,
        permissions.DOCTOR_PRESCRIBE_MEDICINE,
      ];
      break;
    case "ADMIN":
      allowedActions = [permissions.ADMIN];
      break;
    case "RECEPTIONIST":
      allowedActions = [
        permissions.RECEPTION_CREATE_PATIENT,
        permissions.RECEPTION_ADD_APPOINTMENT,
      ];
      break;
    case "PHARMACIST":
      allowedActions = [
        permissions.PHARMACY_PRESCRIPTIONS,
        permissions.PHARMACY_RECEIPT,
      ];
      break;
    case "INVENTORY_MANAGER":
      allowedActions = [
        permissions.INVENTORY_ADD_MEDICINE,
        permissions.INVENTORY_VIEW,
      ];
      break;
    case "CO_ADMIN":
      allowedActions = [
        permissions.DOCTOR_APPOINTMENTS,
        permissions.INVENTORY_VIEW,
        permissions.RECEPTION_ADD_APPOINTMENT,
      ];
      break;
    case "OTHER":
      allowedActions = [];
      break;
    default:
      allowedActions = [];
      break;
  }

  return allowedActions;
};

const loginService = async (email, password) => {
  console.log({ email, password });
  if (!email || !password) throw new Error("No credentials");

  const user = await prisma.auth.findUnique({
    where: { email },
  });
  if (!user) throw new Error("User not found");
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new Error("Wrong Credentials");

  const userDetails = await prisma.profile.findUnique({
    where: { id: user.id },
  });
  const { token, refreshToken, expires } = issueJWT(user);

  console.log({ user, userDetails });

  return {
    user: {
      permissions: user.permissions,
      dataValues: user,
    },
    userDetails,
    token,
    refreshToken,
    expires,
  };
};

const signupService = async (
  email,
  password,
  name,
  role,
  designation,
  contact,
  address,
  bio,
  sex,
  availability,
  availableDays,
  roomNumber,
  authorityName,
  category,
  origin
) => {
  console.log({
    email,
    password,
    name,
    role,
    designation,
    contact,
    address,
    bio,
    sex,
    availability,
    availableDays,
    roomNumber,
    authorityName,
    category,
    origin,
  });
  // use this as a transaction

  if (!email || !password || !name || !role || !sex) {
    throw new Error("Insufficient credentials");
  }

  if (!allowedRoles.includes(role)) throw new Error("Invalid role");
  const allowedActions = addActions(role);

  const hashedPassword = await bcrypt.hash(password, 10);

  const profile = await prisma.profile.create({
    data: {
      designation,
      contact,
      address,
      bio,
      sex,
      availability,
      role: role,
      available_days: availableDays,
      room_number: roomNumber,
      authority_name: authorityName,
      category,
      origin,
    },
  });

  const user = await prisma.Auth.create({
    data: {
      email,
      name,
      profileId: profile.id,
      password: hashedPassword,
      permissions: allowedActions,
    },
    include: {
      profile: true,
    },
  });

  console.log({ user, profile });
  return user;
};

const logoutService = async () => {};

const revalidateService = async (refreshToken) => {
  if (!refreshToken) throw new Error("Unauthorized");

  const { valid, expired, payload } = revalidateJWT(refreshToken);

  if (!valid || expired) throw new Error("Unauthorized");
  const payloadid = payload.sub.id;

  const user = await prisma.auth.findUnique({ where: { id: payloadid } });
  if (!user) throw new Error("Unauthorized");

  const userDetails = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  const { token, expires } = issueJWT(user);
  return {
    user: {
      permissions: user.permissions,
      dataValues: user,
    },
    userDetails,
    token,
    expires,
  };
};

const createDummyService = async () => {
  const role = [
    "DOCTOR",
    "ADMIN",
    "RECEPTIONIST",
    "PHARMACIST",
    "INVENTORY_MANAGER",
    "CO_ADMIN",
    "PATIENT",
  ][Math.floor(Math.random() * 7)];

  if (role === "PATIENT") {
    await prisma.patient.create({
      data: {
        name: faker.name.fullName(),
        age: Math.floor(Math.random() * 100),
        contact: faker.phone.number(),
        sex: "m",
        address: faker.address.city(),
        email: faker.internet.email(),
      },
    });

    return;
  }

  // const auth_data = {
  //   email: faker.internet.email(),
  //   password: "admin123",
  //   name: faker.name.findName(),
  //   permissions: addActions(role),
  // };
};

module.exports = {
  loginService,
  logoutService,
  signupService,
  revalidateService,
  createDummyService,
  allowedRoles,
};
