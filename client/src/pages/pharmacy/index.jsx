import { Tabs } from "antd";
import React from "react";
import Header from "../../components/Header";
import CreateReceipts from "../../components/Pharmacy/CreateReceipts";
import InventoryTable from "../../components/Pharmacy/InventoryTable";
import Notifications from "../doctor/modules/notifications";

const Pharmacy = () => {
  const [online, setOnline] = React.useState(true);
  const user = {
    name: "Pharmacist",
    email: "pharmacist@gmail.com",
    online: online,
  };
  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <Header title="Home" subTitle="" user={user} />;
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Create Receipts" key="1">
          <CreateReceipts />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Notifications" key="2">
          <Notifications />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Inventory" key="3">
          <InventoryTable />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Pharmacy;
