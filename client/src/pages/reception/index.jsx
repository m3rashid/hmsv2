import React, { useState } from "react";
import { Menu, Typography, Divider, Layout } from "antd";

import PageHeader from "../../components/Header";
import CreatePatientForm from "../../components/Reception/CreatePatientForm/CreatePatientForm";
import CreateAppointmentForm from "../../components/Reception/CreateAppointmentForm/CreateAppointmentForm";

const Reception = () => {
  const [online, setOnline] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("createPatient");

  const handleMenuChange = (e) => {
    setSelectedMenu(e.key);
  };

  return (
    <div style={{ padding: "20px" }}>
      <PageHeader online={online} setOnline={setOnline} />
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
