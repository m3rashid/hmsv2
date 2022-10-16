import React from "react";
import { Tabs } from "antd";

import Active from "../../components/Appointments/active"
import Completed from "../../components/Appointments/completed";

const Appointments = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Active" key="1">
          <Active />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Completed" key="2">
          <Completed />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Appointments;
