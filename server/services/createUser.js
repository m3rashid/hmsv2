import db from "../models/index.js";
import bcrypt from "bcrypt";

export const createUserService = async (email, password, role, name) => {
  if (!email || !password || !role || !name) throw new Error("No credentials");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.Auth.create({
    name,
    email,
    password: hashedPassword,
    role: role,
  });

  console.log("user created");
  console.log(user);

  console.log(JSON.stringify(user));
  return { user };
};
