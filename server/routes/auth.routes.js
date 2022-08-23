const express = require("express");

const { login, revalidate, signup, createDummy } = require("../controllers");
const { useRoute } = require("../utils/errors.js");

const router = express.Router();

router.post("/login", useRoute(login));

router.post("/signup", useRoute(signup));

router.post("/revalidate", useRoute(revalidate));

router.post("/dummy", useRoute(createDummy));

module.exports = {
  router,
};
