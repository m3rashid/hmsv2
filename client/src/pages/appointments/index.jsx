import { Divider, Tabs } from "antd";
import React from "react";
import Header from "../../components/Header";

import Active from "./modules/active";
import Completed from "./modules/completed";

const Appointments = () => {
  const [online, setOnline] = React.useState(true);

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <Header online={online} setOnline={setOnline} />
      <Divider />
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
