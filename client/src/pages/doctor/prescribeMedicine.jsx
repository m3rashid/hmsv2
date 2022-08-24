import {
  Form,
  Button,
  Input,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";

import { socket } from "../../api/socket";
import Header from "../../components/Header";
import DisplayMedicine from "./helpers/DisplayMedicine";
import GeneratePdf from "../../components/generatePdf.jsx";
import usePrescribeMedicines from "./helpers/prescribeMeds.hook";
import MedicineInput from "../../components/Doctor/MedicineInput";
import ReferPatientModal from "./helpers/referPatientModal";

const PrescriptionForm = () => {
  const {
    state: {
      loading,
      formData,
      medicines,
      doctorData,
      appointmentId,
      referToAnotherDoctor,
      printContainerRef,
      navigate,
      form,
      PrintButtonRef,
      CreatePrescriptionModalVisible,
    },
    actions: {
      printPdf,
      setLoading,
      setFormData,
      setMedicines,
      setReferToAnotherDoctor,
      formSubmitHandler,
      addEmptyMedicine,
      deleteMedicine,
      handleReferPatientModalShow,
      handleAppointmentSelect,
      setCreatePrescriptionModalVisible,
      UpdateMedicine,
    },
  } = usePrescribeMedicines(socket);

  useEffect(() => {
    socket.on("new-prescription-by-doctor-created", (data) => {
      setLoading({
        PrescribeMedicines: false,
      });
      console.log(data);
      navigate("/doctor/appointments");
    });
    return () => {
      socket.off("new-prescription-by-doctor-created");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    if (appointmentId !== null && doctorData.appointments.length > 0) {
      handleAppointmentSelect(appointmentId);
    }
  }, [appointmentId, doctorData.appointments.length, handleAppointmentSelect]);

  console.log({ medicines });

  return (
    <React.Fragment>
      <div>
        <Header />
      </div>
      <div style={{ padding: 10 }}>
        <Row>
          <Col span={12}>
            <Typography.Title level={4}>Create Prescription</Typography.Title>
            <Form
              form={form}
              onFinish={formSubmitHandler}
              labelAlign="left"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item
                label="Choose Appointment"
                name="appointment"
                rules={[
                  { required: true, message: "Please Enter patient name!" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select an appointment"
                  allowClear
                  onChange={(value) => {
                    console.log("changed", value);
                    handleAppointmentSelect(value);
                  }}
                  optionLabelProp="Appointment"
                >
                  {doctorData.appointments
                    .filter((apt) => apt.pending)
                    .map((appointment) => (
                      <Select.Option
                        key={appointment.id}
                        value={appointment.id}
                      >
                        <span>
                          {appointment.patient?.name} -{" "}
                          {dayjs(appointment.date).format(
                            "MMMM DD YYYY HH:mm A"
                          )}
                        </span>
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Symptoms"
                name="symptoms"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Symptoms!",
                  },
                ]}
              >
                <Input.TextArea
                  required
                  type="text"
                  placeholder="Enter symptoms"
                  allowClear
                  onChange={(e) => {
                    setFormData({ ...formData, symptoms: e.target.value });
                  }}
                />
              </Form.Item>

              <Space direction="vertical" style={{ width: "100%" }}>
                {medicines.medicines.map((medicine, index) => (
                  <MedicineInput
                    key={index}
                    index={index}
                    type="medicines"
                    medicine={medicine}
                    deleteMedicine={deleteMedicine}
                    setMedicines={setMedicines}
                    UpdateMedicine={UpdateMedicine}
                  />
                ))}

                <Button
                  type="primary"
                  htmlType="button"
                  onClick={() => addEmptyMedicine("medicines")}
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
                  + Add New Medicines
                </Button>
              </Space>

              <Space direction="vertical" style={{ width: "100%" }}>
                <strong>Custom Medicines</strong>
                {medicines.extramedicines.map((medicine, index) => (
                  <MedicineInput
                    key={index}
                    index={index}
                    isExtra={true}
                    type="extramedicines"
                    medicine={medicine}
                    deleteMedicine={deleteMedicine}
                    setMedicines={setMedicines}
                    UpdateMedicine={UpdateMedicine}
                  />
                ))}
                <Button
                  type="primary"
                  htmlType="button"
                  onClick={() => addEmptyMedicine("extramedicines")}
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
                  + Add New Extra Medicine
                </Button>
              </Space>

              <Form.Item
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  loading={loading.PrescribeMedicines}
                  type="primary"
                  htmlType="button"
                  onClick={() => setCreatePrescriptionModalVisible(true)}
                >
                  Confirm Create Prescription
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={12} style={{ padding: "10px" }}>
            <DisplayMedicine formData={formData} medicines={medicines} />
          </Col>
        </Row>

        {formData.appointmentInfo && (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              marginBottom: "30px",
              justifyContent: "center",
              gap: "50px",
            }}
          >
            <Button type="primary" className="print__button" onClick={printPdf}>
              Print Prescription
            </Button>

            <Button
              type="primary"
              style={{ background: "#ff0000", border: "none" }}
              onClick={handleReferPatientModalShow}
            >
              Refer Patient to another doctor
            </Button>
          </div>
        )}

        {/* <ReferPatientModal
          modalState={referToAnotherDoctor}
          setModalState={setReferToAnotherDoctor}
          patientId={formData.appointmentInfo.patientId}
          doctorId={formData.appointmentInfo.doctorId}
        /> */}

        <Modal
          visible={CreatePrescriptionModalVisible}
          onOk={() => {
            setCreatePrescriptionModalVisible(false);
            form.submit();
          }}
          onCancel={() => setCreatePrescriptionModalVisible(false)}
          okText="Yes"
          cancelText="No"
        >
          <DisplayMedicine formData={formData} medicines={medicines} />
        </Modal>

        {/* {formData.appointmentInfo && (
          <GeneratePdf
            printContainerRef={printContainerRef}
            data={[
              {
                ...formData,
                medicines: medicines,
                date: dayjs().format("MMMM DD YYYY HH:mm A"),
              },
            ]}
          />
        )} */}
      </div>
    </React.Fragment>
  );
};

export default PrescriptionForm;
