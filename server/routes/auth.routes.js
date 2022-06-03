import express from "express";
const router = express.Router();

import {
  login,
  logout,
  revalidate,
  signup,
  createDummy,
} from "../controllers/auth.js";
import { createUser } from "../controllers/createUser.js";

router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);

router.post("/revalidate", revalidate);

router.post("/createUser", createUser);

router.post("/dummy", createDummy);

export default router;
