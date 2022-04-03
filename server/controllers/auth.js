import bcrypt from "bcrypt";

import db from "../models/index.js";
import AuthModel from "../models/Auth.js";
import { issueJWT } from "../utils/jwt.js";

const Auth = AuthModel(db.sequelize, db.Sequelize).Auth;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("No credentials");

    const user = await Auth.findOne({ email });
    if (!user) throw new Error("User not found");

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) throw new Error("Wrong Credentials");

    const { token, expires } = issueJWT(user);
    res.status(200).json({
      message: "Login Successful",
      token,
      expires,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      throw new Error("No credentials");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("creating user");
    const user = Auth.create({
      email,
      password: hashedPassword,
      role,
    });

    console.log(JSON.stringify(user));
    return res.status(200).json({
      message: "Signup Successful",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const logout = (req, res) => {};