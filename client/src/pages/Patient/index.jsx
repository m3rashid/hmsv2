import {
  Row,
  Col,
  Typography,
  Divider,
  Collapse,
  Space,
  Button,
  Modal,
  Table,
  Drawer,
} from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles.module.css";
import { useQuery } from "react-query";
import { instance } from "../../api/instance";
import dayjs from "dayjs";
import DisplayMedicine from "../../components/Doctor/DisplayMedicine";
import Loading from "../../components/Loading/Loading";

/**
 * @description Displays Patient Info and Appointments
 * @returns {JSX.Element}
 */
const PatientInfo = (props) => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery(
    ["patient", id, props],
    async () => {
      const { data } = await instance.get(`/patient/${id || props.id}`);
      const patient = data.patient;

      patient.Appointment = patient.Appointment.sort((a, b) =>
        dayjs(b.date).diff(a.date)
      );
      return patient;
    }
  );

  const [PrescriptionModal, setPrescriptionModal] = useState({
    visible: false,
    data: {},
  });

  const [DoctorModal, setDoctorModal] = useState({
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

  // Handle Modal
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

  // Schema For Appointment Info
  const AppointmentSchema = useMemo(
    () => [
      {
        title: "Appointment ID.",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Appointment Date",
        dataIndex: "datePrescribed",
        key: "datePrescribed",
        render: (date) => dayjs(date).format("MMMM DD YYYY"), // Format date to "MMMM Do YYYY"
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        key: "remarks",
        render: (remarks) => remarks || "No Remarks", // If no remarks, display "No Remarks"
      },
      {
        title: "Doctor's Name",
        dataIndex: "doctor",
        key: "doctor",
        render: (doctor) => (
          <Button
            type="link"
            onClick={() =>
              setDoctorModal({
                visible: true,
                data: doctor,
              })
            }
          >
            {doctor.authorityName}
          </Button>
        ),
      },
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: (_, record) => (
          <React.Fragment>
            <Button
              onClick={PrescriptionModalHandler(record.Prescription[0])}
              disabled={!record.Prescription[0]}
            >
              {record.Prescription[0] ? "View Prescription" : "No Prescription"}
            </Button>
          </React.Fragment>
        ),
      },
    ],
    [PrescriptionModalHandler]
  );

  if (isLoading || isError) {
    return <Loading />;
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
      <Table columns={AppointmentSchema} dataSource={data.Appointment} />
      <Drawer
        visible={PrescriptionModal.visible}
        onClose={() => setPrescriptionModal({ visible: false })}
      >
        <DisplayMedicine
          ExtraMedicines={PrescriptionModal?.data?.CustomMedicines}
          Medicines={PrescriptionModal?.data?.medicines}
          date={PrescriptionModal?.data?.date}
          symptoms={PrescriptionModal?.data?.symptoms}
          id={PrescriptionModal?.data?.appointmentId}
          patient={data}
        />
      </Drawer>
      <Drawer
        visible={DoctorModal.visible}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        onClose={() => setDoctorModal({ visible: false, data: {} })}
        title="Doctor's Info"
      >
        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
        >
          {DoctorInfo.map((_info, index) => {
            if (!DoctorModal.data[_info.dataIndex]) return null;

            return (
              <Row key={index}>
                <Col span={5}>
                  <Typography.Text strong>{_info.title}</Typography.Text>
                </Col>
                <Col span={19}>
                  <Typography.Text>
                    {DoctorModal.data[_info.dataIndex]}
                  </Typography.Text>
                </Col>
              </Row>
            );
          })}
        </Space>
      </Drawer>
    </div>
  );
};

export default PatientInfo;
