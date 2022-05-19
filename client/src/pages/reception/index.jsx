import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { Menu, Typography, Divider, Layout } from "antd";

import PageHeader from "../../components/Header";
import CreatePatientForm from "../../components/Reception/CreatePatientForm/CreatePatientForm";
import CreateAppointmentForm from "../../components/Reception/CreateAppointmentForm/CreateAppointmentForm";
import { authState } from "../../atoms/auth";

const Reception = () => {
  const [online, setOnline] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("createPatient");
  const auth = useRecoilValue(authState);

  const user = { ...auth.user, online };

  const handleMenuChange = (e) => {
    setSelectedMenu(e.key);
  };

  return (
    <div style={{ padding: "20px" }}>
      <PageHeader title="Receptionist" subTitle="" user={user} />
      <Divider />
      <Typography.Title level={4}>Receptionist</Typography.Title>
      <Divider />
      <Menu
        onClick={handleMenuChange}
        selectedKeys={[selectedMenu]}
        mode="horizontal"
        style={{ backgroundColor: "transparent" }}
      >
        <Menu.Item key="createPatient">Create Patient</Menu.Item>
        <Menu.Item key="createAppointment">Create Appointment</Menu.Item>
      </Menu>
      <Divider />
      <Layout.Content>
        {selectedMenu === "createPatient" && <CreatePatientForm />}
        {selectedMenu === "createAppointment" && <CreateAppointmentForm />}
      </Layout.Content>
    </div>
  );
};

export default Reception;
