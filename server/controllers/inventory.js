const { addDummy, searchInventoryService } = require("../services/inventory");

const CreateDummyInventory = async (req, res) => {
  const count = req.body.count;

  try {
    for (let i = 0; i < count; i++) {
      await addDummy();
    }

    return res.status(200).json({
      message: "Dummy inventory created",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
      error: err,
    });
  }
};

const SearchInventory = async (req, res) => {
  const { quantity, price, name } = req.query;

  try {
    const inventory = await searchInventoryService({ quantity, price, name });
    return res.status(200).json({
      message: `${inventory.length} Inventory found`,
      inventory,
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
  CreateDummyInventory,
  SearchInventory,
};
