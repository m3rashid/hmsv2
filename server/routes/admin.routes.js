const express = require("express");

const { getAllUsers } = require("../controllers/admin");
const { checkAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/all", checkAuth, getAllUsers);

module.exports = {
  router,
};
