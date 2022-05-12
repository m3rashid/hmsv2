import bcrypt from "bcrypt";

import db from "../models/index.js";
import { issueJWT } from "../utils/jwt.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("No credentials");

    const user = await db.Auth.findOne({ email });
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
    const { email, password, role, name } = req.body;
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
