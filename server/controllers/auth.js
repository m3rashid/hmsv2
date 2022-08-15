const {
  createDummyService,
  loginService,
  revalidateService,
  signupService,
} = require("../services/auth.js");

const login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const { user, token, refreshToken, expires, userDetails } =
      await loginService(email, password);

    res.status(200).json({
      message: "Login Successful",
      token,
      refreshToken,
      expires,
      user: {
        ...user.dataValues,
        [user.role]: userDetails,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
      error: err,
    });
  }
};

const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await signupService(email, password, role);

    return res.status(200).json({
      message: "Signup Successful",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
      error: err,
    });
  }
};

const logout = (req, res) => {};

const revalidate = async (req, res) => {
  try {
    const refreshToken = req.headers["authorization"];
    const { user, userDetails, token, expires } = await revalidateService(
      refreshToken
    );
    res.status(200).json({
      message: "Token revalidated",
      token,
      expires,
      user: {
        ...user.dataValues,
        [user.role]: userDetails,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
      error: err,
    });
  }
};

const createDummy = async (req, res) => {
  const { count } = req.body;

  try {
    for (let i = 0; i < count; i++) {
      await createDummyService();
    }

    return res.status(200).json({
      message: "Dummy data created",
      count: count,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
      error: err,
    });
  }
};

module.exports = {
  login,
  signup,
  logout,
  revalidate,
  createDummy,
};
