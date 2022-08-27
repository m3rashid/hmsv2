import dayjs from "dayjs";
import { Form } from "antd";
import { useReactToPrint } from "react-to-print";
import { useCallback, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate, useSearchParams } from "react-router-dom";

import { doctorState } from "../../../atoms/doctor";
import { LoadingAtom } from "../../../atoms/loading";

const usePrescribeMedicines = (socket) => {
  const [form] = Form.useForm();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useRecoilState(LoadingAtom);
  const doctorData = useRecoilValue(doctorState);
  const [formData, setFormData] = useState({});
  const [referToAnotherDoctor, setReferToAnotherDoctor] = useState(false);
  const [CreatePrescriptionModalVisible, setCreatePrescriptionModalVisible] =
    useState(false);

  const [medicines, setMedicines] = useState({
    medicines: [],
    extraMedicines: [],
  });

  const formSubmitHandler = (values) => {
    if (loading?.PrescribeMedicines) return;
    const data = {
      appointment: formData.appointmentInfo.id,
      symptoms: values.symptoms,
      diagnosis: values.diagnosis,
      CustomMedicines: medicines.extraMedicines.map((item) => ({
        name: item.medicine.name,
        quantity: item.medicine.quantityRequired,
        dosage: item.dosage.value,
        duration: item.duration,
      })),
      datetime: new Date(),
      medicines: medicines.medicines.map((item) => {
        return {
          ...item,
          MedicineId: item.id,
          dosage: item.dosage.value,
        };
      }),
    };
    if (loading?.PrescribeMedicines) return;
    setLoading({ PrescribeMedicines: true });
    socket.emit("create-prescription-by-doctor", data);
    form.resetFields();
  };

  const addEmptyMedicine = (type) => {
    setMedicines({
      ...medicines,
      [type]: [
        ...medicines[type],
        { dosage: "", duration: 0, description: "", medicineId: "" },
      ],
    });
  };

  const deleteMedicine = (index, type) => {
    setMedicines((prevState) => {
      prevState[type].splice(index, 1);
      return { ...prevState };
    });
  };

  const UpdateMedicine = useCallback(
    (type, item, index) => {
      console.log(item);
      setMedicines((prevState) => ({
        ...prevState,
        [type]: prevState[type].map((data, i) => (i === index ? item : data)),
      }));
    },
    [setMedicines]
  );

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
      UpdateMedicine,
    },
  };
};

export default usePrescribeMedicines;
