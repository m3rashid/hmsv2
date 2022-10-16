import {
  Button,
  Modal,
  Space,
  Table,
  Typography,
  Popconfirm,
  Tabs,
  Tooltip,
  Drawer,
} from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import React, { useCallback, useEffect, useState } from "react";

import { socket } from "../../api/socket";
import { authState } from "../../atoms/auth";
import { instance } from "../../api/instance";
import { doctorState } from "../../atoms/doctor";
import { LoadingAtom } from "../../atoms/loading";
import { functionState } from "../../atoms/functions";
import ShowEntry from "../../components/common/showEntry";
import PrescriptionDisplay from "../../components/Prescription/PrescriptionDisplay";

const { TabPane } = Tabs;

function DoctorAppointments() {
  const navigate = useNavigate();
  const { user } = useRecoilValue(authState);
  const doctorData = useRecoilValue(doctorState);
  const functionData = useRecoilValue(functionState);
  const [ModalVisible, setModalVisible] = useState({
    visible: false,
    id: null,
    data: {},
  });
  const [PrescriptionDrawer, setPrescriptionDrawer] = useState({
    visible: false,
    id: null,
    data: {},
    type: "",
  });
  const [loadingData, setLoadingData] = useRecoilState(LoadingAtom);

  const ToggleModal = () => {
    setModalVisible({
      ...ModalVisible,
      visible: !ModalVisible.visible,
    });
  };

  const GetPrescriptionByAppointmentID = useCallback(async (record) => {
    const { data } = await instance.get(
      `/doctor/appointment-prescription/${record.id}`
    );

    // console.log(data);
    setPrescriptionDrawer({
      visible: true,
      id: record.id,
      data: data,
    });
  }, []);

  useEffect(() => {
    socket.emit("get-doctor-appointments", { doctorId: user.id });
  }, [user.id]);

  const columnsPending = [
    {
      title: "PatientName",
      dataIndex: "patient",
      key: "patient",
      sorter: (a, b) => a?.patient?.name?.localeCompare(b.patientname),
      render: (item) => {
        return <Typography.Text>{item?.name}</Typography.Text>;
      },
    },
    {
      title: "Date/Time",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => dayjs(a.date).isBefore(dayjs(b.date)),
      render: (item) => dayjs(item).format("MMMM DD YYYY, h:mm:ss a"),
      defaultSortOrder: "ascend",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => {
        const disabled = !dayjs(record.date).isBefore(dayjs().add(6, "hours"));
        return (
          <Space>
            <Popconfirm
              disabled={disabled}
              title="Create a prescription for this appointment?"
              onConfirm={() => {
                navigate(
                  `/doctor/prescribe-medicine?appointmentId=${record.id}`
                );
              }}
              okText="Yes"
              cancelText="Cancel"
            >
              <Tooltip
                placement="left"
                title={
                  disabled
                    ? "Cant prescribe at current time"
                    : "Create a prescription"
                }
              >
                <Button disabled={disabled} type="primary">
                  {" "}
                  Precribe{" "}
                </Button>
              </Tooltip>
            </Popconfirm>
            <Button
              onClick={() => {
                setModalVisible({
                  visible: true,
                  id: record.id,
                  data: record,
                });
              }}
            >
              View
            </Button>
            <Button onClick={() => navigate(`/patient/${record.patient.id}`)}>
              Patient Details
            </Button>
          </Space>
        );
      },
    },
  ];

  const columnsPrevious = [
    {
      title: "PatientName",
      dataIndex: "patient",
      key: "patient",
      sorter: (a, b) => a?.patient?.name?.localeCompare(b?.patient?.name),
      render: (item) => {
        return <Typography.Text>{item?.name}</Typography.Text>;
      },
    },
    {
      title: "Date/Time",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => dayjs(a.date).isBefore(dayjs(b.date)),
      render: (item) => dayjs(item).format("DD MMM, h:mm:ss a"),
      defaultSortOrder: "ascend",
      filters: [
        {
          text: "Today",
          value: 1,
        },
      ],
      onFilter: (value, record) => {
        return dayjs(record.date).isSame(dayjs(), "day");
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (item) => (
        <Typography.Text ellipsis={true}>{item}</Typography.Text>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            onClick={() => {
              setModalVisible({ visible: true, id: record.id, data: record });
            }}
          >
            View Form
          </Button>
          <Button
            onClick={() => {
              GetPrescriptionByAppointmentID(record);
            }}
          >
            View Prescription
          </Button>
          <Button
            onClick={() => {
              navigate(`/patient/${record.patient.id}`);
            }}
          >
            View Patient
          </Button>
        </Space>
      ),
    },
  ];

  const refreshAppointments = useCallback(() => {
    setLoadingData({
      ...loadingData,
      refetchAppointments: true,
    });
    functionData.loadDoctorAppointment().then(() => {
      setLoadingData({
        ...loadingData,
        refetchAppointments: false,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functionData]);

  // console.log(doctorData);

  return (
    <div style={{ marginTop: "20px" }}>
      <Typography.Title
        level={4}
        style={{ width: "100%", textAlign: "center" }}
      >
        Doctor Appointments
      </Typography.Title>
      <Button
        style={{ zIndex: 100, marginTop: 10 }}
        onClick={refreshAppointments}
        loading={loadingData.refetchAppointments}
      >
        <Typography.Text>
          {loadingData.refetchAppointments
            ? "Refreshing Appointments"
            : "Refresh Appointments"}
        </Typography.Text>
      </Button>

      <Tabs defaultActiveKey="1" centered style={{ marginTop: -5 }}>
        <TabPane tab="Active" key="1">
          <Table
            loading={doctorData.loading}
            dataSource={doctorData.appointments.filter((apt) => apt.pending)}
            columns={columnsPending}
            pagination={{
              total: doctorData.appointments.reduce(
                (acc, curr) => (!curr.pending ? acc : acc + 1),
                0
              ),
              pageSize: 5,
            }}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="Completed" key="2">
          <Table
            dataSource={doctorData.appointments.filter((apt) => !apt.pending)}
            columns={columnsPrevious}
            // pagination={{
            //   total: doctorData.appointments.reduce((acc, curr) => curr.pending ? acc : acc + 1, 0),
            //   defaultPageSize: 5,
            // }}
            rowKey="id"
          />
        </TabPane>
      </Tabs>

      <Drawer
        visible={PrescriptionDrawer.visible}
        width={1000}
        onClose={() => {
          setPrescriptionDrawer({ visible: false });
        }}
      >
        <PrescriptionDisplay
          id={PrescriptionDrawer?.data?.appointmentId}
          ExtraMedicines={PrescriptionDrawer?.data?.CustomMedicines}
          Medicines={PrescriptionDrawer?.data?.medicines}
          date={PrescriptionDrawer?.data?.createdAt}
          patient={PrescriptionDrawer?.data?.appointment?.patient}
          symptoms={PrescriptionDrawer?.data?.symptoms}
        />
      </Drawer>

      <Modal
        visible={ModalVisible.visible}
        onOk={ToggleModal}
        onCancel={ToggleModal}
        footer={[
          <Button key="back" onClick={ToggleModal}>
            Close
          </Button>,
        ]}
      >
        <div>
          <ShowEntry
            label="Date and Time"
            value={dayjs(ModalVisible.data?.date).format(
              "MMMM DD YYYY, h:mm:ss a"
            )}
          />
          <div>
            <h4>
              <strong>Patient Info </strong>
            </h4>
            <Space direction="vertical" size={3} style={{ padding: "10px" }}>
              <ShowEntry
                label="Name"
                value={ModalVisible.data?.patient?.name}
              />
              <ShowEntry label="Age" value={ModalVisible.data?.patient?.age} />
              <ShowEntry
                label="Email"
                value={ModalVisible.data?.patient?.email}
              />
            </Space>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DoctorAppointments;
