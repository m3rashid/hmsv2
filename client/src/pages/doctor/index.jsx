import React, { useCallback, useEffect } from "react";
import { Tabs, Divider, message } from "antd";

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
  const user = { ...Auth.user, online };

  const getAppointments = useCallback(async () => {
    const res = await instance.get(`/doctor/get-appointments`);
    console.log(res.data);
    setAppointmentsData(() => {
      return res.data.appointments.map((appointment) => ({
        ...appointment,

        date: moment(appointment.date).format("MMMM Do YYYY, h:mm:ss a"),
        patientname: appointment.Patient.name,
      }));
    });
  }, []);

  useEffect(() => {
    getAppointments();
  }, []);

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
  }, []);

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
        <Tabs.TabPane tab="Prescription" key="5">
          <PrescriptionForm />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Doctor;
