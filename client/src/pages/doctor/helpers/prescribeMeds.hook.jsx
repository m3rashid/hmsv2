import dayjs from "dayjs";
import { Form } from "antd";
import { useRecoilValue } from "recoil";
import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { doctorState } from "../../../atoms/doctor";

const usePrescribeMedicines = (socket) => {
  const [form] = Form.useForm();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const doctorData = useRecoilValue(doctorState);
  const [formData, setFormData] = useState({});
  const [medicines, setMedicines] = useState([]);
  const [print, setPrint] = useState(false);
  const [referToAnotherDoctor, setReferToAnotherDoctor] = useState(false);
  // const [prescription, setPrescription] = useState([]);

  const formSubmitHandler = (values) => {
    if (loading) return;
    const data = {
      appointment: formData.appointmentInfo.id,
      symptoms: values.symptoms,
      diagnosis: values.diagnosis,
      CustomMedicines: values.CustomMedicines,
      datetime: new Date(),
      medicines: medicines.map((item) => {
        return {
          ...item,
          MedicineId: item.id,
          dosage: item.dosage.value,
        };
      }),
    };
    if (loading) return;
    setLoading(true);
    socket.emit("create-prescription-by-doctor", data);
  };

  const addEmptyMedicine = () => {
    setMedicines([
      ...medicines,
      { dosage: "", duration: 0, description: "", medicineId: "" },
    ]);
  };

  const deleteMedicine = (index) => {
    setMedicines([...medicines.slice(0, index), ...medicines.slice(index + 1)]);
  };

  const appointmentId = searchParams.get("appointmentId");

  const handleAppointmentSelect = useCallback(
    (appointment_id) => {
      appointment_id = parseInt(appointment_id);
      const selectedAppointment = doctorData.appointments.find(
        (appointment) => appointment.id === appointment_id
      );

      if (selectedAppointment) {
        setFormData((formData) => ({
          ...formData,
          appointment: `${selectedAppointment.patient.name}-${selectedAppointment.date}`,
          appointmentInfo: selectedAppointment,
        }));
        form.setFieldValue(
          "appointment",
          `${selectedAppointment.patient.name}-${dayjs(
            selectedAppointment.date
          ).format("MMMM DD YYYY hh:mm A")}`
        );
      } else {
        setFormData((formData) => ({
          ...formData,
          appointment: "",
          appointmentInfo: {},
        }));
        form.setFieldValue("appointment", "");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [doctorData.appointments, form]
  );

  const handleReferPatientModalShow = async () => {
    setReferToAnotherDoctor(true);
  };

  return {
    state: {
      loading,
      formData,
      medicines,
      doctorData,
      appointmentId,
      referToAnotherDoctor,
      navigate,
      form,
      print,
    },
    actions: {
      setPrint,
      setLoading,
      setFormData,
      setMedicines,
      setReferToAnotherDoctor,
      formSubmitHandler,
      addEmptyMedicine,
      deleteMedicine,
      handleReferPatientModalShow,
      handleAppointmentSelect,
    },
  };
};

export default usePrescribeMedicines;
