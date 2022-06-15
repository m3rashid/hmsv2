import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import axios from "axios";
import React, { useState } from "react";
import { instance } from "../../api/instance";
import FixedUseContext from "../../Hooks/FixedUseContext";
import { DoctorContext } from "../../pages/doctor";
const { TextArea } = Input;
const { Option } = Select;

function CreateReceipts() {
  const [loading, setLoading] = useState(false);
  const { AppointmentsData } = FixedUseContext(DoctorContext);
  const [AppointmentSearch, setAppSearch] = useState(AppointmentsData);
  const [doctors, setDoctors] = useState({
    data: [],
    cancelToken: undefined,
  });
  const [patients, setPatients] = useState({
    data: [],
    cancelToken: undefined,
  });
  const [form] = Form.useForm();
  const [FormSelected, setFormSelected] = useState({
    doctor: null,
    patient: null,
  });
  const [total, setTotal] = useState(100);
  const formSubmitHandler = (values) => {
    if (loading) return;
    console.log(values);
  };

  const UpdateDoctors = async (value) => {
    if (doctors.cancelToken) {
      doctors.cancelToken.cancel();
    }

    try {
      const CancelToken = axios.CancelToken.source();

      setDoctors({
        data: [
          {
            value: "",
            label: "Loading..",
          },
        ],
        cancelToken: CancelToken,
      });

      const { data } = await instance.get("/doctor/search", {
        params: {
          name: value,
          email: value,
          designation: value,
          contact: value,
        },
      });

      setDoctors({
        ...doctors,
        data: data.doctors.map((doctor) => {
          return {
            value: doctor.id,
            data: doctor,
            label: (
              <Col
                direction="vertical"
                size={"small"}
                style={{
                  fontSize: 12,
                }}
              >
                <Row>
                  <Typography.Text>{doctor.name}</Typography.Text>
                  <Typography.Text type="danger">
                    {"("}
                    {doctor.designation}
                    {")"}
                  </Typography.Text>
                </Row>
                <Row>
                  <Typography.Text disabled>{doctor.email}</Typography.Text>
                </Row>
              </Col>
            ),
          };
        }),
        cancelToken: doctors.cancelToken ? doctors.cancelToken : CancelToken,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const UpdatePatients = async (value) => {
    console.log(value);

    if (patients.cancelToken) {
      patients.cancelToken.cancel();
    }

    try {
      const CancelToken = axios.CancelToken.source();

      setPatients({
        data: [
          {
            value: "",
            label: "Loading..",
          },
        ],
        cancelToken: CancelToken,
      });

      const { data } = await instance.get(
        "/patient/search",
        {
          params: {
            name: value,
            email: value,
            jamiaId: value,
          },
        },
        {
          cancelToken: CancelToken.token,
        }
      );
      console.log(data);

      setPatients({
        ...patients,
        data: data.patients.map((patient) => {
          return {
            value: patient.id,
            data: patient,
            label: (
              <Col
                direction="vertical"
                size={"small"}
                style={{
                  fontSize: 12,
                }}
              >
                <Row>
                  <Typography.Text>{patient.name}</Typography.Text>
                  <Typography.Text type="danger">
                    {"("}
                    {patient.age} years old
                    {")"}
                  </Typography.Text>
                </Row>
                <Row>
                  <Typography.Text disabled>{patient.email}</Typography.Text>
                </Row>
              </Col>
            ),
          };
        }),
        cancelToken: patients.cancelToken ? patients.cancelToken : CancelToken,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Form
        onFinish={formSubmitHandler}
        labelAlign="left"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 8 }}
      >
        <Form.Item
          label="Choose Prescription"
          name="appointment"
          rules={[{ required: true, message: "Please Enter patient name!" }]}
        >
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select an Prescription"
            defaultValue={[]}
            onChange={() => {
              console.log("changed");
            }}
            optionLabelProp="Appointment"
          >
            {AppointmentSearch?.map((appointment) => (
              <Option key={appointment.id} value={appointment.id}>
                <span>
                  {appointment.patientname} - {appointment.date}
                </span>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Patient"
          name="patient"
          rules={[{ required: true, message: "Please select a patient!" }]}
        >
          <AutoComplete
            id="patient"
            placeholder="Patient Name"
            options={patients.data}
            onSearch={(value) => UpdatePatients(value)}
            onSelect={(value) => {
              form.setFieldsValue({
                patient: value,
              });
              setFormSelected({
                ...FormSelected,
                patient: patients.data.find(
                  (patient) => patient.value === value
                ),
              });
            }}
          />

          <Typography.Text
            disabled
            style={{
              fontSize: 10,
            }}
          >
            *Search by (name or email or jamia Id)
          </Typography.Text>
        </Form.Item>

        <Form.Item
          label="Doctor Name"
          name="doctor"
          rules={[{ required: true, message: "Please select a doctor!" }]}
        >
          <AutoComplete
            options={doctors.data}
            id="doctor"
            placeholder="Doctor Name"
            onSearch={(value) => UpdateDoctors(value)}
            onSelect={(value) => {
              form.setFieldsValue({
                doctor: value,
              });
              setFormSelected({
                ...FormSelected,
                doctor: doctors.data.find((doctor) => doctor.value === value),
              });
            }}
          />
          <Typography.Text
            disabled
            style={{
              fontSize: 10,
            }}
          >
            *Search by (name or designation)
          </Typography.Text>
        </Form.Item>
        <Form.Item label="Medicines" name="Medicines">
          <Select
            mode="multiple"
            style={{
              width: "100%",
            }}
            placeholder="select a medicine"
            // defaultValue={["diclo"]}
            onChange={() => {
              console.log("changed");
            }}
            optionLabelProp="label"
          >
            <Option value="diclo" label="Diclo">
              <div className="demo-option-label-item">
                <span role="img" aria-label="Diclo">
                  💊&nbsp;
                </span>
                Diclo
              </div>
            </Option>
            <Option value="aspirin" label="Aspirin">
              <div className="demo-option-label-item">
                <span role="img" aria-label="Aspirin">
                  💊&nbsp;
                </span>
                Aspirin
              </div>
            </Option>
            <Option value="amlokind-5" label="Amlokind-5">
              <div className="demo-option-label-item">
                <span role="img" aria-label="Amlokind-5">
                  💊&nbsp;
                </span>
                Amlokind-5
              </div>
            </Option>
            <Option value="urimax-500" label="Urimax-500">
              <div className="demo-option-label-item">
                <span role="img" aria-label="Urimax-500">
                  💊&nbsp;
                </span>
                Urimax-500
              </div>
            </Option>
          </Select>
        </Form.Item>
        <Form.Item label="Custom Medicines" name="Custom Medicines">
          <TextArea type="text" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 11 }}>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            Price : ₹&nbsp;{total}
          </div>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 12 }}>
          <Button loading={loading} type="primary" htmlType="submit">
            Print
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateReceipts;
