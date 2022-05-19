import React from "react";
import { Tabs, Divider } from "antd";

import Header from "../../components/Header";
import Appointments from "./modules/Appointments";
import Patients from "./modules/patients";
import Notifications from "./modules/notifications";
import { authState } from "../../atoms/auth";
import { useRecoilValue } from "recoil";

const Doctor = () => {
  const [online, setOnline] = React.useState(true);
  const Auth = useRecoilValue(authState);
  const user = { ...Auth.user, online };
  return (
    <div style={{ padding: "20px" }}>
      <Header title="Doctor" subTitle="" user={user} />
      <Divider />

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Appointments" key="1">
          <Appointments />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Patients" key="3">
          <Patients />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Notifications" key="4">
          <Notifications />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Doctor;
