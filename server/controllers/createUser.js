import { createUserService } from "../services/createUser.js";

export const createUser = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    const { user } = await createUserService(email, password, role, name);
    return res.status(200).json({
      message: "User creation Successful",
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
