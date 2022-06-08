import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Input,
  AutoComplete,
  DatePicker,
  message,
  Typography,
  Space,
  Grid,
  Row,
  Col,
} from "antd";
import { socket } from "../../../api/socket";
import { instance } from "../../../api/instance";
import axios from "axios";

const CreateAppointmentForm = () => {
  const [doctors, setDoctors] = useState({
    data: [],
    cancelToken: undefined,
  });
  const [patients, setPatients] = useState({
    data: [],
    cancelToken: undefined,
  });
  const [FormSelected, setFormSelected] = useState({
    doctor: null,
    patient: null,
  });

  console.log(FormSelected, setFormSelected);

  useEffect(() => {
    socket.on("new-appointment-created", (data) => {
      message.success(`Appointment for ${data.id} created successfully!`);
    });

    return () => {
      socket.off("new-appointment-created");
    };
  }, []);

  const [form] = Form.useForm();

  const formSubmitHandler = (values) => {
    console.log(values);
    socket.emit("create-appointment", {
      patientId: values.patient,
      patient: FormSelected.patient,
      doctor: FormSelected.doctor,
      doctorId: values.doctor,
      date: values.datetime,
    });
  };
  useEffect(() => {
    instance.get("/reception/doctors").then((res) => {
      console.log(res.data);
      setDoctors(
        res.data?.map((doctor) => ({
          value: doctor.email,
          label: `${doctor.name}`,
        }))
      );
    });
    socket.on("created-appointment", (data) => {
      console.log(data);
      message.success(`Appointment ${data.title} created successfully!`);
    });

    return () => {
      socket.off("created-appointment");
    };
  }, []);

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

  return (
    <Form
      form={form}
      onFinish={formSubmitHandler}
      labelAlign="left"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 8 }}
    >
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
              patient: patients.data.find((patient) => patient.value === value),
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
      <Form.Item
        label="Date"
        name="datetime"
        rules={[{ required: true, message: "Please enter date and time !" }]}
      >
        <DatePicker showTime />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 2 }}>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateAppointmentForm;
