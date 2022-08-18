import { message } from "antd";
import { socket } from "../../api/socket";
import useNotifications from "../../Hooks/useNotifications";
import { checkAccess, permissions } from "../../routes";
import { authState } from "../../atoms/auth";
import { doctorState } from "../../atoms/doctor";

import { instance } from "../../api/instance";
import React, { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export default function useFetchDoctor() {
  const auth = useRecoilValue(authState);
  const [DoctorData, setDoctorData] = useRecoilState(doctorState);
  const { addNotification } = useNotifications();

  const loadDoctorAppointment = useCallback(async () => {
    const res = await instance.get(`/doctor/get-appointments`);
    console.log(res.data);
    setDoctorData({
      ...DoctorData,
      appointments: res.data.appointments,
    });
  }, [DoctorData, setDoctorData]);

  useEffect(() => {
    if (
      auth.isLoggedIn &&
      auth.user.permissions.includes(permissions.DOCTOR_APPOINTMENTS)
    ) {
      loadDoctorAppointment();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const loadMedicine = useCallback(async () => {}, []);

  const addAppointment = useCallback(
    async (data) => {
      console.log(DoctorData, data);
      setDoctorData((prev) => {
        return {
          ...prev,
          appointments: [...prev.appointments, data],
        };
      });
    },
    [DoctorData, setDoctorData]
  );

  useEffect(() => {
    console.log("Checking Access for Doctor Prescriptions");
    if (
      !auth.isLoggedIn ||
      !auth.user.permissions.includes(permissions.DOCTOR_PRESCRIBE_MEDICINE)
    )
      return;

    console.log("Connected New Prescription By Doctor");
    socket.on("new-prescription-by-doctor-created", ({ data }) => {
      message.success(
        `New Prescription for ${data.prescription.id} created successfully!`
      );
    });

    return () => {
      socket.off("new-prescription-by-doctor-created");
    };
  }, [auth]);

  useEffect(() => {
    if (
      !auth.isLoggedIn ||
      !auth.user.permissions.includes(permissions.DOCTOR_APPOINTMENTS)
    )
      return;

    console.log("Connected New Appointment By Doctor");
    socket.on("new-appointment-created", (data) => {
      console.log("Some Appointment Created");

      message.info(`New appointment created`);
      addNotification({
        type: "success",
        title: "New Appointment",
        message: `${data.patient.name} has a new appointment`,
        action: {
          label: "View",
          callback: () => {
            console.log("View Appointment");
          },
        },
      });
      addAppointment(data);
    });
    return () => {
      socket.off("new-appointment-created");
    };
  }, [addAppointment, addNotification, auth]);

  console.log("Updated Doctor Data", DoctorData);
}
