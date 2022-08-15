const express = require("express");

const {
  CreateDummyInventory,
  SearchInventory,
} = require("../controllers/inventory");

const router = express.Router();

router.post("/dummy", CreateDummyInventory);
router.get("/search", SearchInventory);

module.exports = {
  router,
};
