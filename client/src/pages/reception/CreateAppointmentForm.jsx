import {
  Form,
  Button,
  AutoComplete,
  message,
  Typography,
  Row,
  Col,
  Space,
  Card,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { socket } from "../../api/socket";
// import { Days } from "../../utils/constants";
import { instance } from "../../api/instance";
import DoctorSelector from "../../components/Doctor/DoctorSelector";
import DoctorDisplay from "../../components/Doctor/DoctorDisplay";
import DoctorTimeSelector from "../../components/Reception/TimeSelector";

const CreateAppointmentForm = () => {
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
      doctorId: FormSelected?.doctor?.id,
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
    socket.on("created-appointment", (data) => {
      message.success(`Appointment ${data.title} created successfully!`);
    });

    return () => {
      socket.off("created-appointment");
    };
  }, [form]);

  // const createRange = useCallback((acc, last) => {
  //   const result = [];
  //   for (let i = 0; i < last; i++) {
  //     const canAdd = acc.every((item) => {
  //       return i > item[1] && i < item[0];
  //     });

  //     if (canAdd) {
  //       result.push(i);
  //     }
  //   }
  //   return result;
  // }, []);

  // const isAllowedDate = useCallback(
  //   (current, isDate) => {
  //     const day = current?.day();
  //     const hour = current?.hour();
  //     const minute = current?.minute();
  //     const DayArr = Object.values(Days);
  //     const DayChosen = DayArr[day];

  //     const doctor = FormSelected.doctor;

  //     if (!doctor) return true;

  //     const availableDay = doctor.profile.availability.find(
  //       (avail) => avail.day === DayChosen
  //     );
  //     if (!availableDay) {
  //       if (isDate) return true;
  //       return {};
  //     }
  //     if (isDate === true) return false;

  //     const availableTime = availableDay.range.reduce(
  //       (acc, range) => {
  //         acc.minute.push([range?.from?.minute, range?.to?.minute]);
  //         acc.hour.push([range?.from?.hour, range?.to?.hour]);

  //         return acc;
  //       },
  //       {
  //         minute: [],
  //         hour: [],
  //       }
  //     );

  //     const res = {
  //       disabledMinutes: () => createRange(availableTime.minute, 60),
  //       disabledHours: () => createRange(availableTime.hour, 24),
  //     };

  //     console.log(res);
  //     return res;
  //   },
  //   [FormSelected.doctor, createRange]
  // );

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

  return (
    <React.Fragment>
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
              label="Doctor Name"
              name="doctor"
              rules={[{ required: true, message: "Please select a doctor!" }]}
            >
              <DoctorSelector
                onChange={(value) => {
                  setFormSelected({
                    ...FormSelected,
                    doctor: value,
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              label="Date"
              name="datetime"
              rules={[
                { required: true, message: "Please enter date and time !" },
              ]}
            >
              <DoctorTimeSelector
                onChange={(value) => {
                  form.setFieldsValue({ datetime: value });
                  setFormSelected({
                    ...FormSelected,
                    datetime: value,
                  });
                }}
                doctor={FormSelected?.doctor}
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
                <DoctorDisplay doctor={FormSelected.doctor?.profile} />
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
