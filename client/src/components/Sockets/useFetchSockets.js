import { message } from "antd";
import { socket } from "../../api/socket";
import useNotifications from "../../Hooks/useNotifications";
import { checkAccess, permissions } from "../../routes";
import { authState } from "../../atoms/auth";
import { doctorState } from "../../atoms/doctor";

import { instance } from "../../api/instance";
import React, { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { inventoryState } from "../../atoms/inventory";
import { InventoryTypes } from "../../utils/inventoryTypes";

// Used for all on socket events
export default function useFetchSockets() {
  const auth = useRecoilValue(authState);
  const [DoctorData, setDoctorData] = useRecoilState(doctorState);
  const [InventoryData, setInventoryData] = useRecoilState(inventoryState);
  const { addNotification } = useNotifications();

  /** Socket Events for Inventory Roles */
  const loadInventoryItems = useCallback(async () => {
    try {
      const MedicineInventory = await instance.get("/inventory/search", {
        params: {
          type: InventoryTypes.Medicine,
          name: "",
        },
      });
      const NonMedicineInventory = await instance.get("/inventory/search", {
        params: {
          type: InventoryTypes.NonMedicine,
          name: "",
        },
      });

      const otherAssetsInventory = await instance.get("/inventory/search", {
        params: {
          type: InventoryTypes.OtherAssets,
          name: "",
        },
      });


      setInventoryData({
        [InventoryTypes.Medicine]: MedicineInventory.data,
        [InventoryTypes.NonMedicine]: NonMedicineInventory.data,
        [InventoryTypes.OtherAssets]: otherAssetsInventory.data,
      });
    } catch (err) {
      console.log(err);
    }
  }, [setInventoryData]);

  useEffect(() => {
    console.log(auth)
    if (
      auth.isLoggedIn &&
      (auth.user.permissions.includes(permissions.INVENTORY_VIEW) ||
        auth.user.permissions.includes(permissions.DOCTOR_PRESCRIBE_MEDICINE) ||
        auth.user.permissions.includes(permissions.INVENTORY_ADD_MEDICINE))
    ) {
      loadInventoryItems();
    }
  }, [auth, loadInventoryItems]);

  /** Socket events for Pharmacy Roles */

  /** Socket events for Doctor Roles */

  /**Load Doctor Appointments */
  const loadDoctorAppointment = useCallback(async () => {
    const res = await instance.get(`/doctor/get-appointments`);
    console.log(res.data);
    setDoctorData({
      ...DoctorData,
      appointments: res.data.appointments,
    });
  }, [DoctorData, setDoctorData]);

  /**
   * @description : Load Doctor Patients
   */
  useEffect(() => {
    if (
      auth.isLoggedIn &&
      auth.user.permissions.includes(permissions.DOCTOR_APPOINTMENTS)
    ) {
      loadDoctorAppointment();
      loadMedicine();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const loadMedicine = useCallback(async () => { }, []);

  /**
   * Add Appointment in Doctor Appointments
   */
  const addAppointment = useCallback(
    async (data) => {

      setDoctorData((prev) => {
        return {
          ...prev,
          appointments: [...prev.appointments, data],
        };
      });
    },
    [setDoctorData]
  );
  const setAppointmentPendingStatus = useCallback(
    async (id, pending) => {
      setDoctorData(prev => ({ ...prev, appointments: prev.appointments.map(apt => apt.id === id ? { ...apt, pending } : apt) }));
    }, [setDoctorData]
  );
  /**
   * On Doctor Create New Prescription
   */
  useEffect(() => {
    console.log("Checking Access for Doctor Prescriptions");
    if (
      !auth.isLoggedIn ||
      !auth.user.permissions.includes(permissions.DOCTOR_PRESCRIBE_MEDICINE)
    )
      return;

    socket.on("new-prescription-by-doctor-created", ({ data }) => {
      console.log(data);
      setAppointmentPendingStatus(data.prescription.appointment.id, false);
      message.success(
        `New Prescription for ${data.prescription.id} created successfully!`
      );

    });

    return () => {
      socket.off("new-prescription-by-doctor-created");
    };
  }, [auth, setAppointmentPendingStatus]);

  /**
   * Notify Doctor on New Appointment Created
   */
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
