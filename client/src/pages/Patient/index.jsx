import {
  Row,
  Col,
  Typography,
  Divider,
  Collapse,
  Space,
  Button,
  Modal,
} from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles.module.css";
import { useQuery } from "react-query";
import { instance } from "../../api/instance";
import dayjs from "dayjs";
import DisplayMedicine from "../../components/Doctor/DisplayMedicine";

/**
 * @description Displays Patient Info and Appointments
 * @returns {JSX.Element}
 */
const Patient = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery(["patient", id], async () => {
    const { data } = await instance.get(`/patient/${id}`);
    const patient = data.patient;

    patient.Appointment = patient.Appointment.sort((a, b) =>
      dayjs(b.date).diff(a.date)
    );
    return patient;

    // if (!data) return;
    // return data?.patient?.map((patient) => ({
    //   ...patient,
    //   Appointment: patient.Appointment.sort((a, b) =>
    //     dayjs(b.date).diff(a.date)
    //   ),
    // }));
  });

  const [PrescriptionModal, setPrescriptionModal] = useState({
    visible: false,
    data: {},
  });

  // Data Schema for Patient Info
  const InfoSchema = useMemo(
    () => [
      {
        title: "ID No.",
        dataIndex: "id",
      },
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Age",
        dataIndex: "age",
      },
      {
        title: "Address",
        dataIndex: "address",
      },
      {
        title: "Contact",
        dataIndex: "contact",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Sex",
        dataIndex: "sex",
      },
    ],
    []
  );

  // Data Schema for Doctor Info
  const DoctorInfo = useMemo(
    () => [
      {
        title: "ID No.",
        dataIndex: "id",
      },
      {
        title: "Authority Name",
        dataIndex: "authorityName",
      },
      {
        title: "Designation",
        dataIndex: "designation",
      },
      {
        title: "Sex",
        dataIndex: "sex",
      },
      {
        title: "Bio",
        dataIndex: "bio",
      },
    ],
    []
  );

  // Schema For Appointment Info
  const AppointmentSchema = useMemo(
    () => [
      {
        name: "Appointment ID.",
        dataIndex: "id",
      },
      {
        name: "Appointment Date",
        dataIndex: "datePrescribed",
        render: (date) => dayjs(date).format("MMMM Do YYYY"), // Format date to "MMMM Do YYYY"
      },
      {
        name: "Remarks",
        dataIndex: "remarks",
      },
    ],
    []
  );

  const PrescriptionModalHandler = useCallback(
    (item) => () => {
      setPrescriptionModal(() => {
        const state = {
          visible: true,
          data: item,
        };

        state.data.medicines = state.data.medicines.map((medicine) => ({
          ...medicine,
          ...medicine?.Medicine,
        }));

        return state;
      });
    },
    [setPrescriptionModal]
  );

  console.log(data);

  if (isLoading || isError) {
    return <>Loading...</>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography.Title level={2}>Patient Info</Typography.Title>
      <Divider>Patient's Info</Divider>
      <Col span={24}>
        {data &&
          InfoSchema.map((item, index) => {
            if (!data[item.dataIndex]) return null;
            return (
              <Row
                span={12}
                key={index}
                className={styles.info__schema__container}
              >
                <Col span={5} className={styles.patient__info__header}>
                  <Typography.Text>{item.title}</Typography.Text>
                </Col>
                <Col span={6}>
                  <Typography.Text>{data[item.dataIndex]}</Typography.Text>
                </Col>
              </Row>
            );
          })}
      </Col>
      <Divider>Patient's History</Divider>
      <Collapse>
        {data?.Appointment?.map((item, index) => {
          return (
            <Collapse.Panel
              key={index}
              header={dayjs(item.date).format("MMMM DD YYYY")}
            >
              <Col>
                {AppointmentSchema.map((_item, index) => {
                  if (!item[_item.dataIndex]) return null;
                  return (
                    <Row>
                      <Col span={5}>
                        <Typography.Text>{_item.name}</Typography.Text>
                      </Col>
                      <Col span={6}>
                        <Typography.Text>
                          {_item.render
                            ? _item?.render(item[_item.dataIndex])
                            : item[_item.dataIndex]}
                        </Typography.Text>
                      </Col>
                    </Row>
                  );
                })}
                <Row
                  style={{
                    paddingTop: "10px",
                  }}
                >
                  <Space
                    direction="vertical"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Typography.Text strong>Doctor Details</Typography.Text>
                    {DoctorInfo.map((_info, index) => {
                      if (!item.doctor[_info.dataIndex]) return null;

                      return (
                        <Row key={index}>
                          <Col span={5}>
                            <Typography.Text>{_info.title}</Typography.Text>
                          </Col>
                          <Col span={6}>
                            <Typography.Text>
                              {item.doctor[_info.dataIndex]}
                            </Typography.Text>
                          </Col>
                        </Row>
                      );
                    })}
                    <Space>
                      <Typography.Text strong type="danger">
                        Symptoms
                      </Typography.Text>
                      <Typography.Text>
                        {item.Prescription[0]?.symptoms}
                      </Typography.Text>
                    </Space>
                    {item.Prescription.length >= 1 ? (
                      <Button
                        type="primary"
                        onClick={PrescriptionModalHandler(item.Prescription[0])}
                      >
                        View Prescription
                      </Button>
                    ) : (
                      <Typography.Text type="danger">
                        Not Prescribed Yet
                      </Typography.Text>
                    )}
                  </Space>
                </Row>
              </Col>
            </Collapse.Panel>
          );
        })}
      </Collapse>
      <Modal
        visible={PrescriptionModal.visible}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        onOk={() => setPrescriptionModal({ visible: false })}
        onCancel={() => setPrescriptionModal({ visible: false })}
      >
        <DisplayMedicine
          ExtraMedicines={PrescriptionModal?.data?.CustomMedicines}
          Medicines={PrescriptionModal?.data?.medicines}
          date={PrescriptionModal?.data?.date}
          symptoms={PrescriptionModal?.data?.symptoms}
          id={PrescriptionModal?.data?.appointmentId}
          patient={data}
        />
      </Modal>
    </div>
  );
};

export default Patient;
