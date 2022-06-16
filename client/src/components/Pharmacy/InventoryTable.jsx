import { Table } from "antd";
import React, { useContext } from "react";
import { PharmacyContext } from "../../pages/pharmacy";

const columns = [
  {
    title: "Medicine",
    dataIndex: "medicine",
    key: "medicine",
  },
  {
    title: "Qty",
    dataIndex: "qty",
    key: "qty",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
];

function InventoryTable() {
  const { Inventory } = useContext(PharmacyContext);

  return (
    <div>
      <Table dataSource={Inventory} columns={columns} />
    </div>
  );
}

export default InventoryTable;
