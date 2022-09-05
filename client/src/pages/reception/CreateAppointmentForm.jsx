import {
  Form,
  Button,
  AutoComplete,
  DatePicker,
  message,
  Typography,
  Row,
  Col,
  Divider,
  Space,
  Card,
} from "antd";
import moment from "moment";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { socket } from "../../api/socket";
import Header from "../../components/Header";
import { instance } from "../../api/instance";

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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("new-appointment-created", (data) => {
      setLoading(false);
      message.success(
        `Appointment for ${data?.patient?.name} created successfully!`
      );
    });

    return () => {
      socket.off("new-appointment-created");
    };
  }, []);

  const [form] = Form.useForm();

  const formSubmitHandler = (values) => {
    const data = {
      patientId: FormSelected?.patient?.data?.id,
      patient: FormSelected?.patient,
      doctor: FormSelected?.doctor,
      doctorId: FormSelected?.doctor?.data?.id,
      date: values.datetime,
    };
    if (loading) return;
    setLoading(true);
    socket.emit("create-appointment", data);
    form.resetFields();
    setFormSelected({
      doctor: null,
      patient: null,
    });
  };

  useEffect(() => {
    // instance.get("/reception/doctors").then((res) => {
    //   setDoctors(
    //     res.data?.map((doctor) => ({
    //       value: doctor.email,
    //       label: `${doctor.name}`,
    //     }))
    //   );
    // });
    socket.on("created-appointment", (data) => {
      message.success(`Appointment ${data.title} created successfully!`);
    });

    return () => {
      socket.off("created-appointment");
    };
  }, []);

  const UpdatePatients = async (value) => {
    if (patients.cancelToken) {
      patients.cancelToken.cancel();
    }

    try {
      const CancelToken = axios.CancelToken.source();

      setPatients({
        data: [{ value: "", label: "Loading.." }],
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
        { cancelToken: CancelToken.token }
      );

      setPatients({
        ...patients,
        data: data.patients.map((patient) => {
          return {
            value: `${patient.name}, ${patient.jamiaId || patient.email || ""}`,
            data: patient,
            label: (
              <Col direction="vertical" size={"small"} style={{ fontSize: 12 }}>
                <Row>
                  <Typography.Text>{patient.name}</Typography.Text>
                  {patient.jamiaId && (
                    <Typography.Text type="danger">
                      {`(${patient.jamiaId})`}
                    </Typography.Text>
                  )}
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
    } catch (err) {}
  };

  const UpdateDoctors = async (value) => {
    if (doctors.cancelToken) {
      doctors.cancelToken.cancel();
    }

    try {
      const CancelToken = axios.CancelToken.source();

      setDoctors({
        data: [{ value: "", label: "Loading.." }],
        cancelToken: CancelToken,
      });

      const { data } = await instance.get("/doctor/search", {
        params: {
          name: value,
          email: value,
          designation: value,
          contact: value,
          time: {
            hour: moment(FormSelected.datetime).hour(),
            minute: moment(FormSelected.datetime).minute(),
            day: moment(FormSelected.datetime).day(),
          },
        },
      });

      setDoctors({
        ...doctors,
        data: data.doctors.map((doctor) => {
          return {
            value: `${doctor.name} - ${doctor?.profile?.designation || ""}`,
            data: doctor,
            label: (
              <Col direction="vertical" size={"small"} style={{ fontSize: 12 }}>
                <Row>
                  <Space>
                    <Typography.Text>{doctor.name}</Typography.Text>
                    {doctor.profile.designation && (
                      <Typography.Text type="danger">
                        {`${"("}${doctor.profile.designation}${")"}`}
                      </Typography.Text>
                    )}
                  </Space>
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
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <Header />

      <Divider />

      <Row>
        <Col span={12}>
          <Form
            form={form}
            onFinish={formSubmitHandler}
            labelAlign="left"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ padding: 20 }}
          >
            <Typography.Title
              level={4}
              style={{ marginTop: 10, marginBottom: 30 }}
            >
              Create Appointment
            </Typography.Title>
            <Form.Item
              label="Date"
              name="datetime"
              rules={[
                { required: true, message: "Please enter date and time !" },
              ]}
            >
              <DatePicker
                showTime
                allowClear
                // defaultValue={moment()}
                disabledDate={(current) => current && current < moment()}
                onChange={(value) => {
                  form.setFieldsValue({ datetime: value });
                  setFormSelected({
                    ...FormSelected,
                    datetime: value,
                  });
                }}
              />
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
                allowClear
                onSelect={(value) => {
                  const patientData = patients.data.find(
                    (patient) => patient.value === value
                  );
                  if (!patientData) return;
                  setFormSelected({
                    ...FormSelected,
                    patient: patients.data.find(
                      (patient) => patient.value === value
                    ),
                  });
                }}
                onClear={() => {
                  setFormSelected({ ...FormSelected, patient: null });
                }}
                onChange={(value) => {
                  const patientData = patients.data.find(
                    (patient) => patient.value === value
                  );
                  if (!patientData) {
                    setFormSelected({ ...FormSelected, patient: null });
                    form.setFieldsValue({ patient: null });
                    return;
                  } else {
                    setFormSelected({
                      ...FormSelected,
                      patient: patientData,
                    });
                    form.setFieldsValue({ patient: patientData.value });
                  }
                }}
              />

              <Typography.Text disabled style={{ fontSize: 10 }}>
                *Search by (name or email or jamia Id)
              </Typography.Text>
            </Form.Item>

            <Form.Item
              label="Doctor Name"
              name="doctor"
              rules={[{ required: true, message: "Please select a doctor!" }]}
            >
              <AutoComplete
                disabled={!FormSelected.datetime}
                options={doctors.data}
                id="doctor"
                placeholder="Doctor Name"
                onSearch={(value) => UpdateDoctors(value)}
                onSelect={(value) => {
                  form.setFieldsValue({ doctor: value });
                  setFormSelected({
                    ...FormSelected,
                    doctor: doctors.data.find(
                      (doctor) => doctor.value === value
                    ),
                  });
                }}
                allowClear
                onClear={() => {
                  setFormSelected({
                    ...FormSelected,
                    doctor: null,
                  });
                }}
                onChange={(value) => {
                  const doctorData = doctors.data.find(
                    (doctor) => doctor.value === value
                  );

                  if (!doctorData) {
                    setFormSelected({
                      ...FormSelected,
                      doctor: null,
                    });
                    form.setFieldsValue({ doctor: "" });
                  } else {
                    setFormSelected({
                      ...FormSelected,
                      doctor: doctorData,
                    });
                    form.setFieldsValue({ doctor: doctorData.value });
                  }
                }}
              />
              <Typography.Text disabled style={{ fontSize: 10 }}>
                *Search by (name or designation)
              </Typography.Text>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 2 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Appointment
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={12} style={{ paddingTop: 20 }}>
          <Typography.Title
            level={4}
            style={{ marginTop: 10, paddingLeft: 25 }}
          >
            Appointment Details
          </Typography.Title>
          <Row style={{ paddingLeft: 25 }}>
            <Col>
              <Typography.Text level={4}>Date : </Typography.Text>
            </Col>
            <Col span={20}>
              <Typography.Text
                level={4}
                style={{ marginLeft: 10 }}
                type="danger"
              >
                {form.getFieldValue("datetime")?.format("YYYY-MM-DD HH:mm A") ||
                  "N/A"}
              </Typography.Text>
            </Col>
          </Row>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Card title="Patient Details" style={{ background: "transparent" }}>
              {FormSelected.patient ? (
                <Space direction="vertical">
                  <Typography.Text type="danger">
                    ID : {FormSelected.patient?.data?.id}
                  </Typography.Text>
                  <Typography.Text>
                    {FormSelected.patient?.data?.name}
                  </Typography.Text>
                  <Typography.Text>
                    Contact : {FormSelected.patient?.data?.contact}
                  </Typography.Text>
                  <Typography.Text disabled>
                    {FormSelected.patient?.data?.email}
                  </Typography.Text>
                </Space>
              ) : (
                <Typography.Text>No Patient Selected</Typography.Text>
              )}{" "}
            </Card>

            <Card title="Doctor Details" style={{ background: "transparent" }}>
              {FormSelected.doctor ? (
                <Space direction="vertical">
                  <Typography.Text type="danger">
                    ID : {FormSelected.doctor?.data?.id}
                  </Typography.Text>
                  <Typography.Text>
                    {FormSelected.doctor?.data?.name}
                  </Typography.Text>
                  <Typography.Text disabled>
                    {FormSelected.doctor?.data?.email}
                  </Typography.Text>
                </Space>
              ) : (
                <Typography.Text>No Doctor Selected</Typography.Text>
              )}
            </Card>
          </Space>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CreateAppointmentForm;
