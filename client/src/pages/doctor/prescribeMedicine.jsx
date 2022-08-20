import React, { useCallback, useEffect, useState } from "react";
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
  Divider,
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
import { useSearchParams, useNavigate } from "react-router-dom";
import { quantityCalculator } from "../../components/Doctor/quantityCalculator";
import GeneratePdf from "../../components/generatePdf.jsx";

const { TextArea } = Input;
const { Option } = Select;

const PrescriptionForm = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const doctorData = useRecoilValue(doctorState);
  const [formData, setFormData] = useState({});
  const [medicines, setMedicines] = useState([]);
  const [prescription, setPrescription] = useState([]);
  const [form] = Form.useForm();
  

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("new-prescription-by-doctor-created", (data) => {
      setLoading(false);
      navigate("/doctor/appointments");
    });
    return () => {
      socket.off("new-prescription-by-doctor-created");
    };
  }, [navigate]);

  const formSubmitHandler = (values) => {
    if (loading) return;

    const data = {
      appointment: formData.appointmentInfo.id,
      symptoms: values.symptoms,
      diagnosis: values.diagnosis,
      CustomMedicines: values.CustomMedicines,
      datetime: new Date(),
      medicines: medicines,
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

  const appointmentId = searchParams.get('appointmentId');


  const handleAppointmentSelect = useCallback((appointment_id) => {
    appointment_id = parseInt(appointment_id);
    const selectedAppointment = doctorData.appointments.find(
      (appointment) => appointment.id === appointment_id
    );

    if (selectedAppointment) {
      setFormData(formData => ({
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
      setFormData(formData => ({
        ...formData,
        appointment: "",
        appointmentInfo: {},
      }));
      form.setFieldValue("appointment", "");
    }
  }, [doctorData.appointments, form])



  useEffect(() => {
    // return;
    if (appointmentId !== null && doctorData.appointments.length > 0) {
      handleAppointmentSelect(appointmentId);
    }
  }, [appointmentId, doctorData.appointments.length, handleAppointmentSelect]);

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
                  placeholder="Select an appointment"
                  allowClear
                  onChange={(value) => {
                    console.log("changed", value);
                    handleAppointmentSelect(value);
                  }}
                  optionLabelProp="Appointment"
                >
                  {doctorData.appointments.map((appointment) => (
                    <Option key={appointment.id} value={appointment.id}>
                      <span>
                        {appointment.patient?.name} -{" "}
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
                    setFormData({ ...formData, symptoms: e.target.value });
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
                <TextArea
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

            <Card
              title="Medicines"
              style={{
                background: "transparent",
              }}
            >
              <Space direction="vertical" size={"large"}>
                {medicines.map((medicine, index) => (
                  <Space
                    direction="vertical"
                    key={index}
                    style={{
                      marginLeft: 20,
                    }}
                  >
                    <Space>
                      <Typography.Text
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {medicine?.medicine?.name}
                      </Typography.Text>
                      <Typography.Text
                        style={{
                          padding: "5px 10px",
                          borderRadius: 5,
                          fontSize: "12px",
                          backgroundColor: "#ff4d4f",
                          color: "#fff",
                        }}
                      >
                        # {medicine?.medicine?.id}
                      </Typography.Text>
                    </Space>
                    <Space
                      direction="vertical"
                      style={{
                        padding: "10px",
                      }}
                    >
                      <Typography.Text>
                        Duration : <strong>{medicine?.duration} Days</strong>
                      </Typography.Text>
                      <Typography.Text>
                        Dosage : <strong>{medicine?.dosage?.label}</strong>
                      </Typography.Text>
                      <Typography.Text>
                        Quantity Required :{" "}
                        <strong>
                          {quantityCalculator(
                            medicine?.duration,
                            medicine?.dosage?.value
                          )}
                        </strong>
                      </Typography.Text>
                      <Typography.Text>{medicine?.description}</Typography.Text>
                    </Space>
                  </Space>
                ))}
              </Space>
            </Card>
            <Card
              title="Custom Medicines"
              style={{
                background: "transparent",
              }}
            >
              {formData?.CustomMedicines}
            </Card>
          </Col>
        </Row>
        <GeneratePdf
          data={[
            {
              ...formData,
              medicines: medicines,
              date: dayjs().format("MMMM DD YYYY HH:mm A"),
            },
          ]}
        />
      </div>
    </React.Fragment>
  );
};

export default PrescriptionForm;
