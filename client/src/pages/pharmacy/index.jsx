import { message, Tabs, Badge } from "antd";
import { faker } from "@faker-js/faker";
import React, { createContext } from "react";

import { socket } from "../../api/socket";
import Header from "../../components/Header";
import Notifications from "../doctor/notifications";
import usePharmacy from "../../components/Pharmacy/usePharmacy";

import useNotifications from "../../Hooks/useNotifications";

import Prescriptions from "./Prescriptions";
import InventoryTable from "./InventoryTable";
import CreateReceipts from "./CreateReceipts";

export const PharmacyContext = createContext();

const Pharmacy = () => {
  const [online, setOnline] = React.useState(true);
  const { Inventory, setInventory, getMedicine, reduceMedicine } =
    usePharmacy();

  const { unseenNotifications, addNotification, markAllAsSeen } =
    useNotifications();

  React.useEffect(() => {
    socket.on("new-prescription-by-doctor-created", ({ data }) => {
      console.log({ newPrescription: data });
      message.success(
        `New Prescription for ${data.prescription.id} created successfully!`
      );
      addNotification({
        type: "success",
        message: `New Prescription for ${data.prescription.id} created successfully!`,
        title: "New Prescription",
      });

      setPrescription((prev) => {
        return [
          ...prev,
          {
            id: data.prescription.id,
            patientname: data.patient?.name,
            doctorname: data.doctor?.name,
            date: data.prescription?.datePrescribed,
            medicine: data.prescription?.prescription,
            CustomMedicines: data.prescription?.CustomMedicines?.split("\n"),
          },
        ];
      });
    });

    return () => {
      socket.off("new-prescription-by-doctor-created");
    };
  }, [addNotification]);

  const [prescription, setPrescription] = React.useState([
  
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
          <Tabs.TabPane
            tab={
              <div onClick={() => markAllAsSeen()}>
                <Badge
                  count={unseenNotifications()}
                  showZero={false}
                  offset={[5, -5]}
                >
                  Notifications
                </Badge>{" "}
              </div>
            }
            key="2"
          >
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
