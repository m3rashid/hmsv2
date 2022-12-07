import { message } from "antd";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { socket } from "api/instance";
import { authState } from "atoms/auth";
import { instance } from "api/instance";
import { doctorState } from "atoms/doctor";
import { LoadingAtom } from "atoms/loading";
import { pharmacyState } from "atoms/pharmacy";
import { functionState } from "atoms/functions";
import { inventoryState } from "atoms/inventory";
import useNotifications from "Hooks/useNotifications";
import { InventoryTypes, allPermissions } from "utils/constants";

// Used for all on socket events
export default function useFetchSockets() {
  const auth = useRecoilValue(authState);
  const [DoctorData, setDoctorData] = useRecoilState(doctorState);
  const [, setInventoryData] = useRecoilState(inventoryState);
  const [, setPharmacyData] = useRecoilState(pharmacyState);
  const [, setLoadingData] = useRecoilState(LoadingAtom);
  const [, setFunctionData] = useRecoilState(functionState);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("error", (data) => {
      message.error(data.message);
      setLoadingData({});
    });

    return () => {
      socket.off("error");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    } catch (err) {}
  }, [setInventoryData]);

  useEffect(() => {
    if (
      auth.isLoggedIn &&
      (auth.user.permissions.includes(allPermissions.INVENTORY_VIEW) ||
        auth.user.permissions.includes(
          allPermissions.DOCTOR_PRESCRIBE_MEDICINE
        ) ||
        auth.user.permissions.includes(allPermissions.INVENTORY_ADD_MEDICINE))
    ) {
      loadInventoryItems();
    }
  }, [auth, loadInventoryItems]);

  /** Socket events for Pharmacy Roles */
  const loadPharmacyPrescriptions = useCallback(async () => {
    const { data } = await instance.get(`/pharmacy/prescriptions`);

    setPharmacyData((prev) => ({
      ...prev,
      prescriptions: data.prescriptions,
    }));
  }, [setPharmacyData]);
  useEffect(() => {
    if (
      !auth.isLoggedIn ||
      !auth.user.permissions.includes(allPermissions.PHARMACY_PRESCRIPTIONS)
    ) {
      return;
    }
    loadPharmacyPrescriptions();
    socket.on("new-prescription-by-doctor-created", ({ data }) => {
      setPharmacyData((prevData) => ({
        ...prevData,
        prescriptions: [...prevData.prescriptions, data.prescription],
      }));
      message.info(`New Prescription for ${data.prescription.id}!`);
    });
    socket.on("prescription-dispensed", ({ data }) => {
      loadPharmacyPrescriptions();
      message.success(
        `Prescription ${data.prescription.id} has been dispensed!`
      );
    });

    return () => {
      socket.off("new-prescription-by-doctor-created");
      socket.off("prescription-dispensed");
    };
  }, [
    auth,
    loadPharmacyPrescriptions,
    navigate,
    setLoadingData,
    setPharmacyData,
  ]);

  /** Socket events for Doctor Roles */

  /**Load Doctor Appointments */
  const loadDoctorAppointment = useCallback(async () => {
    setDoctorData((prev) => ({ ...prev, loading: true }));
    const res = await instance.get(`/doctor/get-appointments`);
    setDoctorData({
      ...DoctorData,
      appointments: res.data.appointments,
      loading: false,
    });
  }, [DoctorData, setDoctorData]);

  /**
   * @description : Load Doctor Patients
   */
  useEffect(() => {
    if (
      auth.isLoggedIn &&
      auth.user.permissions.includes(allPermissions.DOCTOR_APPOINTMENTS)
    ) {
      loadDoctorAppointment();
      loadMedicine();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const loadMedicine = useCallback(async () => {}, []);

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
      setDoctorData((prev) => ({
        ...prev,
        appointments: prev.appointments.map((apt) =>
          apt.id === id ? { ...apt, pending } : apt
        ),
      }));
    },
    [setDoctorData]
  );

  /**
   * On Doctor Create New Prescription
   */
  useEffect(() => {
    if (
      !auth.isLoggedIn ||
      !auth.user.permissions.includes(allPermissions.DOCTOR_PRESCRIBE_MEDICINE)
    ) {
      return;
    }

    socket.on("new-prescription-by-doctor-created", ({ data }) => {
      loadDoctorAppointment();
      setLoadingData({});
      navigate("/doctor/appointments");

      message.success(
        `New Prescription for ${data.prescription.appointment.patient.name} created successfully!`
      );
    });

    return () => {
      socket.off("new-prescription-by-doctor-created");
    };
  }, [
    auth,
    loadDoctorAppointment,
    navigate,
    setAppointmentPendingStatus,
    setLoadingData,
  ]);

  /**
   * Notify Doctor on New Appointment Created
   */
  useEffect(() => {
    if (
      !auth.isLoggedIn ||
      !auth.user.permissions.includes(allPermissions.DOCTOR_APPOINTMENTS)
    ) {
      return;
    }

    socket.on("new-appointment-created", (data) => {
      message.info(`New appointment created`);
      addNotification({
        type: "success",
        title: "New Appointment",
        message: `${data.patient.name} has a new appointment`,
        action: {
          label: "View",
          callback: () => {},
        },
      });
      addAppointment(data);
    });

    return () => {
      socket.off("new-appointment-created");
    };
  }, [addAppointment, addNotification, auth]);

  useEffect(() => {
    setFunctionData({
      addAppointment,
      addNotification,
      loadDoctorAppointment,
      setAppointmentPendingStatus,
      loadPharmacyPrescriptions,
      loadInventoryItems,
    });
  }, [
    addAppointment,
    addNotification,
    loadDoctorAppointment,
    loadInventoryItems,
    loadPharmacyPrescriptions,
    setAppointmentPendingStatus,
    setFunctionData,
  ]);
}
