import React, { useState } from "react";

function usePharmacy() {
  const [Inventory, setInventory] = useState([
    {
      medicine: "Diclo",
      qty: 50,
      price: 100,
    },
    {
      medicine: "Aspirin",
      qty: 50,
      price: 42,
    },
    {
      medicine: "Amlokind-5",
      qty: 50,
      price: 32,
    },
    {
      medicine: "Urimax-500",
      qty: 50,
      price: 90,
    },
  ]);

  const getMedicine = (name) => {
    return Inventory.filter((inv) => inv.medicine === name);
  };

  const reduceMedicine = (name, value) => {
    setInventory((inv) => {
      const newinv = inv.map((inventory) => {
        if (inventory.medicine === name)
          return {
            ...inventory,
            qty: inventory.qty - value,
          };
        else return inventory;
      });

      return newinv;
    });
  };

  return {
    Inventory,
    setInventory,
    getMedicine,
    reduceMedicine,
  };
}

export default usePharmacy;
