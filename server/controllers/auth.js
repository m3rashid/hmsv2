import {
  loginService,
  revalidateService,
  signupService,
} from "../services/auth.js";

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const { user, token, refreshToken, expires } = await loginService(
      email,
      password
    );
    res.status(200).json({
      message: "Login Successful",
      token,
      refreshToken,
      expires,
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

export const signup = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    const user = await signupService(email, password, role, name);

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

export const logout = (req, res) => {};

export const revalidate = async (req, res) => {
  try {
    const refreshToken = req.headers["authorization"];
    const { user, token, expires } = await revalidateService(refreshToken);
    res.status(200).json({
      message: "Token revalidated",
      token,
      expires,
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
