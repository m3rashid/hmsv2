const { faker } = require("@faker-js/faker");
const {
  loginService,
  revalidateService,
  signupService,
} = require("../services");
const { Days, Category } = require("@prisma/client");

const login = async (req, res) => {
  const { user, token, refreshToken, expires, userDetails } =
    await loginService(req.body.email, req.body.password);

  return res.status(200).json({
    message: "Login Successful",
    token,
    refreshToken,
    expires,
    user: {
      ...user.dataValues,
      userDetails: userDetails,
    },
  });
};

const signup = async (req, res) => {
  let user = {};
  if (req.body.isDummy) {
    const designation = ["MBBS", "BDS"];
    user = await signupService({
      email: faker.internet.email(),
      password: "admin123",
      name: faker.name.fullName(),
      role: req.body.role,
      sex: req.body.sex,

      // Optional
      designation:
        designation[
          faker.datatype.number({
            min: 0,
            max: designation.length,
          })
        ],
      contact: faker.phone.number(),
      address: faker.address.city(),
      bio: faker.lorem.paragraph(),
      availability: req.body.availability,
      availableDays: Object.values(Days).slice(0, faker.datatype.number(6)),
      roomNumber: faker.datatype.number().toString(),
      authorityName: faker.name.fullName(),
      category: Object.values(Category)[faker.datatype.number(Category.length)],
      origin: req.body.origin,
      createdBy: req.userId || 1,
    });
  } else {
    user = await signupService({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      role: req.body.role,
      sex: req.body.sex,

      designation: req.body.designation,
      contact: req.body.contact,
      address: req.body.address,
      bio: req.body.bio,
      availability: req.body.availability,
      availableDays: req.body.availableDays,
      roomNumber: req.body.roomNumber,
      authorityName: req.body.authorityName,
      category: req.body.category,
      origin: req.body.origin,

      createdBy: req.userId || 1,
    });
  }
  return res.status(200).json({
    message: "Signup Successful",
    user,
  });
};

const revalidate = async (req, res) => {
  const refreshToken = req.headers["authorization"];
  const { user, userDetails, token, expires } = await revalidateService(
    refreshToken
  );

  return res.status(200).json({
    message: "Token revalidated",
    token,
    expires,
    user: { ...user.dataValues, [user.role]: userDetails },
  });
};

module.exports = {
  login,
  signup,
  revalidate,
};
