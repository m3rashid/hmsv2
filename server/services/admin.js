const bcrypt = require("bcrypt");

const prisma = require("../utils/prisma");
const { supportedUserRoles, serverActions } = require("../utils/constants");
const { addEventLog } = require("../utils/logs");

const getAllUsersService = async (userRole) => {
  if (!userRole) return [];
  if (!supportedUserRoles.includes(userRole)) {
    throw new Error("Invalid user role");
  }

  const users = await prisma.profile.findMany({
    where: { role: userRole },
    include: { Auth: true },
  });

  return users;
};

const editPermissionsService = async (
  userId,
  permissions,

  // TODO unhandled
  createdBy
) => {
  if (!userId || !permissions) throw new Error("Invalid data");
  const user = await prisma.auth.update({
    where: { id: userId },
    data: { permissions },
  });

  await addEventLog({
    action: serverActions.EDIT_PERMISSIONS,
    fromId: createdBy,
    actionId: user.id,
    actionTable: "auth",
  });

  return user;
};

const updateUserProfileService = async (
  userId,
  profileId,
  {
    name,
    email,
    password,

    sex,
    designation,
    contact,
    address,
    bio,
    availability,
    availableDays,
    roomNumber,
    authorityName,
    category,
    origin,
  },

  // TODO unhandled
  createdBy
) => {
  if (!userId || !profileId) throw new Error("Insufficient data");

  let hashedPassword = "";
  if (password && password.trim() !== "") {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const updatedAuth = await prisma.auth.update({
    where: { id: userId },
    data: {
      ...(email && email.trim() && { email: email }),
      ...(hashedPassword && { password: hashedPassword }),
      ...(name && name.trim() && { name: name }),
    },
  });

  const updatedProfile = await prisma.profile.update({
    where: { id: profileId },
    data: {
      ...(sex && sex.trim() && { sex }),
      ...(designation && designation.trim() && { designation }),
      ...(contact && contact.trim() && { contact }),
      ...(address && address.trim() && { address }),
      ...(bio && bio.trim() && { bio }),
      ...(availability && availability.trim() && { availability }),
      ...(availableDays && availableDays.trim() && { availableDays }),
      ...(roomNumber && roomNumber.trim() && { roomNumber }),
      ...(authorityName && authorityName.trim() && { authorityName }),
      ...(category && category.trim() && { category }),
      ...(origin && origin.trim() && { origin }),
    },
  });

  await addEventLog({
    action: serverActions.UPDATE_PROFILE,
    fromId: createdBy,
    actionId: profileId,
    actionTable: "profile",
  });

  return {
    auth: updatedAuth,
    profile: updatedProfile,
  };
};

module.exports = {
  getAllUsersService,
  editPermissionsService,
  updateUserProfileService,
};
