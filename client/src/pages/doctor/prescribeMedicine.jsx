import {
  Form,
  Button,
  Input,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Card,
  Collapse,
  Modal,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";

import { socket } from "../../api/socket";
import Header from "../../components/Header";
import GeneratePdf from "../../components/generatePdf.jsx";
import MedicineInput from "../../components/Doctor/MedicineInput";

import usePrescribeMedicines from "./helpers/prescribeMeds.hook";
import SingleMedicine from "./helpers/singleMedicine";
import DisplayMedicine from "./helpers/DisplayMedicine";

const PrescriptionForm = () => {
  const {
    state: {
      loading,
      print,
      formData,
      medicines,
      doctorData,
      appointmentId,
      // referToAnotherDoctor,
      navigate,
      form,
      PrintButtonRef,
      CreatePrescriptionModalVisible,
    },
    actions: {
      setPrint,
      setLoading,
      setFormData,
      setMedicines,
      // setReferToAnotherDoctor,
      formSubmitHandler,
      addEmptyMedicine,
      deleteMedicine,
      handleReferPatientModalShow,
      handleAppointmentSelect,
      setCreatePrescriptionModalVisible,
    },
  } = usePrescribeMedicines(socket);

  useEffect(() => {
    socket.on("new-prescription-by-doctor-created", (data) => {
      setLoading({
        PrescribeMedicines: false,
      });
      PrintButtonRef.current.click();
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
                  {doctorData.appointments.map((appointment) => (
                    <Select.Option key={appointment.id} value={appointment.id}>
                      <span>
                        {appointment.patient?.name} -{" "}
                        {dayjs(appointment.date).format("MMMM DD YYYY HH:mm A")}
                      </span>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Symptoms" name="symptoms">
                <Input.TextArea
                  type="text"
                  placeholder="Enter symptoms"
                  allowClear
                  onChange={(e) => {
                    setFormData({ ...formData, symptoms: e.target.value });
                  }}
                />
              </Form.Item>

              <Space direction="vertical" style={{ width: "100%" }}>
                {medicines.map((medicine, index) => (
                  <MedicineInput
                    key={index}
                    index={index}
                    medicine={medicine}
                    deleteMedicine={deleteMedicine}
                    setMedicines={setMedicines}
                  />
                ))}

                <Button
                  type="primary"
                  htmlType="button"
                  onClick={addEmptyMedicine}
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
                  + Add New Medicines
                </Button>
              </Space>

              <Form.Item label="Custom Medicines" name="CustomMedicines">
                <Input.TextArea
                  type="text"
                  placeholder="Enter custom medicines"
                  allowClear
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      CustomMedicines: e.target.value,
                    });
                  }}
                />
              </Form.Item>

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
          <Col
            span={12}
            style={{
              padding: "10px",
            }}
          >
            <DisplayMedicine formData={formData} medicines={medicines} />
          </Col>
        </Row>

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
          <Button
            type="primary"
            onClick={() => setPrint(true)}
            className="print__button"
            ref={PrintButtonRef}
          >
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

        {/* Alert on Submit Modal */}
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

        <Collapse bordered={false} style={{ padding: 0, margin: 0 }}>
          <Collapse.Panel header="Show print preview" key="1">
            <GeneratePdf
              print={print}
              data={[
                {
                  ...formData,
                  medicines: medicines,
                  date: dayjs().format("MMMM DD YYYY HH:mm A"),
                },
              ]}
            />
          </Collapse.Panel>
        </Collapse>
      </div>
    </React.Fragment>
  );
};

export default PrescriptionForm;
