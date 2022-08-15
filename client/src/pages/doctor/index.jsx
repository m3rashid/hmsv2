import React, { useCallback, useEffect } from "react";
import { Tabs, Divider } from "antd";

import Header from "../../components/Header";
import Appointments from "./modules/Appointments";
import Patients from "./modules/patients";
import Notifications from "./modules/notifications";
import { authState } from "../../atoms/auth";
import { useRecoilValue } from "recoil";
import { socket } from "../../api/socket";
import moment from "moment";
import { instance } from "../../api/instance";
import PrescriptionForm from "../../components/Doctor/prescribeMedicine";

export const DoctorContext = React.createContext();

const Doctor = () => {
  const [online, setOnline] = React.useState(true);
  const [AppointmentsData, setAppointmentsData] = React.useState([]);
  const Auth = useRecoilValue(authState);

  const getAppointments = useCallback(async () => {
    const res = await instance.get(`/doctor/get-appointments`);
    console.log(res.data);
    setAppointmentsData(() => {
      return res.data.appointments.map((appointment) => ({
        ...appointment,

        date: moment(appointment.date).format("MMMM Do YYYY, h:mm:ss a"),
        patientname: appointment.patient.name,
      }));
    });
  }, []);

  useEffect(() => {
    getAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(AppointmentsData);

  useEffect(() => {
    socket.on("new-appointment-created", (data) => {
      if (data.doctor.AuthId === Auth.user.id) {
        console.log(data);
        setAppointmentsData((prev) => [
          {
            date: moment(data.Appointment.date).format(
              "MMMM Do YYYY, h:mm:ss a"
            ),
            patientname: data.patient.name,
            id: data.id,
          },
          ...prev,
        ]);
      }
    });

    return () => {
      socket.off("new-appointment-created");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DoctorContext.Provider value={{ AppointmentsData }}>
      <div style={{ padding: "20px" }}>
        <Header online={online} setOnline={setOnline} />
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
          <Tabs.TabPane tab="Prescription" key="5">
            <PrescriptionForm />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </DoctorContext.Provider>
  );
};

export default Doctor;
