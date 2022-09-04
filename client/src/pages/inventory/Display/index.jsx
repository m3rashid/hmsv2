import { Tabs } from "antd";
import React from "react";
import { InventoryTypes } from "../../../utils/constants";
import InventoryTable from "./components/InventoryTable";

function InventoryDisplay() {
  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <Tabs>
        <Tabs.TabPane tab="Medicines" key="1">
          <InventoryTable type={InventoryTypes.Medicine} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Non Medicines" key="2">
          <InventoryTable type={InventoryTypes.NonMedicine} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Other Assets" key="3">
          <InventoryTable type={InventoryTypes.OtherAssets} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default InventoryDisplay;
