import { message, Tabs } from "antd";
import React, { createContext } from "react";
import Header from "../../components/Header";
import CreateReceipts from "../../components/Pharmacy/CreateReceipts";
import InventoryTable from "../../components/Pharmacy/InventoryTable";
import Prescriptions from "../../components/Pharmacy/Prescriptions";
import Notifications from "../doctor/modules/notifications";
import { faker } from "@faker-js/faker";
import usePharmacy from "../../components/Pharmacy/usePharmacy";
import { socket } from "../../api/socket";

export const PharmacyContext = createContext();

const Pharmacy = () => {
  const [online, setOnline] = React.useState(true);
  const { Inventory, setInventory, getMedicine, reduceMedicine } =
    usePharmacy();

  React.useEffect(() => {
    socket.on("new-prescription-by-doctor-created", ({ data }) => {
      console.log({ newPrescription: data });
      message.success(`New Prescription for ${data.id} created successfully!`);
      setPrescription((prev) => {
        return [
          ...prev,
          {
            id: data.prescription.id,
            patientname: data.patient.name,
            doctorname: data.doctor.name,
            date: data.prescription.datePrescribed,
            medicine: data.prescription.prescription,
            CustomMedicines: data.prescription.CustomMedicines.split("\n"),
          },
        ];
      });
    });

    return () => {
      socket.off("new-prescription-by-doctor-created");
    };
  }, []);

  const [prescription, setPrescription] = React.useState([
    {
      id: faker.datatype.uuid(),
      patientname: "Sarfraz Alam",
      doctorname: "Dr. Ali",
      date: "2020-01-01",
      medicine: ["Diclo", "Aspirin", "Amlokind-5", "Urimax-500"],
      CustomMedicines: [],
    },
  ]);

  return (
    <PharmacyContext.Provider
      value={{
        prescription,
        setPrescription,
        Inventory,
        setInventory,
        getMedicine,
        reduceMedicine,
      }}
    >
      <div style={{ padding: "20px" }}>
        <Header online={online} setOnline={setOnline} />
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Prescriptions" key="0">
            <Prescriptions />
          </Tabs.TabPane>
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
    </PharmacyContext.Provider>
  );
};

export default Pharmacy;
