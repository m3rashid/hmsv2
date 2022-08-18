import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Form,
  Button,
  // Radio,
  Input,
  // InputNumber,
  message,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Card,
  // AutoComplete,
} from "antd";
// import { socket } from "../../api/socket";
import FixedUseContext from "../../Hooks/FixedUseContext";
import { DoctorContext } from ".";
import { socket } from "../../api/socket";
import MedicineInput from "../../components/Doctor/MedicineInput";
import { useRecoilValue } from "recoil";
import { doctorState } from "../../atoms/doctor";
import Header from "../../components/Header";
import useFetchSockets from "../../components/Sockets/useFetchSockets";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const PrescriptionForm = () => {
  const [loading] = useState(false);

  const doctorData = useRecoilValue(doctorState);
  const [formData, setformData] = useState({});
  const [medicines, setMedicines] = useState([]);
  const [form] = Form.useForm();

  const formSubmitHandler = (values) => {
    if (loading) return;
    console.log(values);
    // socket.emit("create-prescription-by-doctor", {
    //   ...values,
    //   datetime: moment().format("YYYY-MM-DD"),
    //   medicines,
    // });
  };

  const addEmptyMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", quantity: 0, description: "" },
    ]);
  };

  const deleteMedicine = (index) => {
    setMedicines([...medicines.slice(0, index), ...medicines.slice(index + 1)]);
  };

  console.log(formData);

  useEffect(() => {
    console.log(medicines);
  }, [medicines]);

  console.log(form.getFieldsValue(true));

  return (
    <React.Fragment>
      <div>
        <Header />
      </div>
      <div
        style={{
          padding: 10,
        }}
      >
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
                  style={{
                    width: "100%",
                  }}
                  placeholder="select an appointment"
                  allowClear
                  onChange={(value) => {
                    console.log("changed", value);
                    const selectedAppointment = doctorData.appointments.find(
                      (appointment) => appointment.id === value
                    );

                    console.log(selectedAppointment);
                    if (selectedAppointment) {
                      setformData({
                        ...formData,
                        appointment: `${selectedAppointment.patient.name}-${selectedAppointment.date}`,
                        appointmentInfo: selectedAppointment,
                      });
                      form.setFieldValue(
                        "appointment",
                        `${selectedAppointment.patient.name}-${dayjs(
                          selectedAppointment.date
                        ).format("MMMM DD YYYY HH:mm A")}`
                      );
                    } else {
                      setformData({
                        ...formData,
                        appointment: "",
                        appointmentInfo: {},
                      });
                      form.setFieldValue("appointment", "");
                    }
                  }}
                  optionLabelProp="Appointment"
                >
                  {doctorData.appointments.map((appointment) => (
                    <Option key={appointment.id} value={appointment.id}>
                      <span>
                        {appointment.patient.name} -{" "}
                        {dayjs(appointment.date).format("MMMM DD YYYY HH:mm A")}
                      </span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Symptoms" name="symptoms">
                <TextArea
                  type="text"
                  placeholder="Enter symptoms"
                  allowClear
                  onChange={(e) => {
                    setformData({ ...formData, symptoms: e.target.value });
                  }}
                />
              </Form.Item>

              <Space
                direction="vertical"
                style={{
                  width: "100%",
                }}
              >
                {medicines.map((medicine, index) => (
                  <React.Fragment>
                    <MedicineInput
                      index={index}
                      medicine={medicine}
                      deleteMedicine={deleteMedicine}
                      setMedicines={setMedicines}
                    />
                  </React.Fragment>
                ))}

                <Button
                  type="primary"
                  htmlType="button"
                  onClick={addEmptyMedicine}
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  + Add New Medicines
                </Button>
              </Space>

              <Form.Item label="Custom Medicines" name="CustomMedicines">
                <TextArea type="text" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 3 }}>
                <Button loading={loading} type="primary" htmlType="submit">
                  Create
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
            <Typography.Title level={4}>Prescription Preview</Typography.Title>
            <Card
              title="Appointment Details"
              style={{
                background: "transparent",
              }}
            >
              <Space direction="vertical">
                <Typography.Text>
                  Appointment ID: {formData?.appointmentInfo?.id}
                </Typography.Text>
                <Typography.Text>
                  Patient Name: {formData?.appointmentInfo?.patient.name}
                </Typography.Text>
                <Typography.Text>
                  Date:{" "}
                  {dayjs(formData?.appointmentInfo?.date).format(
                    "MMMM DD YYYY HH:mm A"
                  )}
                </Typography.Text>
              </Space>
            </Card>
            <Space
              direction="vertical"
              style={{
                marginLeft: 20,
                padding: 20,
                width: "75%",
                borderRadius: 15,
                backgroundColor: "#fff",
              }}
            >
              <Typography.Text type="success">Symptoms:</Typography.Text>
              <Typography.Text>{formData?.symptoms}</Typography.Text>
            </Space>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default PrescriptionForm;
