import dayjs from "dayjs";
import { Form } from "antd";
import { useCallback, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate, useSearchParams } from "react-router-dom";

import { doctorState } from "../../../atoms/doctor";
import { Loadingatom } from "../../../atoms/loading";
import { useReactToPrint } from "react-to-print";

const usePrescribeMedicines = (socket) => {
  const [form] = Form.useForm();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useRecoilState(Loadingatom);
  const doctorData = useRecoilValue(doctorState);
  const [formData, setFormData] = useState({});
  const [medicines, setMedicines] = useState([]);
  const [referToAnotherDoctor, setReferToAnotherDoctor] = useState(false);
  const [CreatePrescriptionModalVisible, setCreatePrescriptionModalVisible] =
    useState(false);

  const formSubmitHandler = (values) => {
    if (loading?.PrescribeMedicines) return;
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
    if (loading?.PrescribeMedicines) return;
    setLoading({
      PrescribeMedicines: true,
    });
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

  const printContainerRef = useRef(null);
  const printPdf = useReactToPrint({
    content: () => printContainerRef.current,
  });

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
      printContainerRef,
      CreatePrescriptionModalVisible,
    },
    actions: {
      printPdf,
      setLoading,
      setFormData,
      setMedicines,
      setCreatePrescriptionModalVisible,
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