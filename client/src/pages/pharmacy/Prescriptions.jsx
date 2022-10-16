import dayjs from "dayjs";
import { useRecoilValue } from "recoil";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message, Button, Space, Table, Tabs, Drawer } from "antd";

import ShowReceipt from "./ShowReciept";
import { instance } from "../../api/instance";
import { pharmacyState } from "../../atoms/pharmacy";
import PrescriptionDisplay from "../../components/Prescription/PrescriptionDisplay";


function Prescriptions() {
  const pharmacyData = useRecoilValue(pharmacyState);
  const navigate = useNavigate();
  const [ModalVisible, setModalVisible] = React.useState({
    visible: false,
    id: null,
    type: null,
    data: {},
  });

  const ToggleModal = () => {
    setModalVisible({
      ...ModalVisible,
      visible: !ModalVisible.visible,
    });
  };

  const ShowPrescriptionHandler = useCallback(async (record, type) => {
    try {
      const { data } = await instance.get(
        `/pharmacy/prescriptions/${record.id}`
      );

      // console.log("Show Prescription", data);

      setModalVisible({
        visible: true,
        id: record.id,
        type: type,
        data: data.prescription,
      });
    } catch (err) {
      message.error("Error Occurred While Fetching");
    }
  }, []);

  const pendingColumns = [
    {
      title: "PatientName",
      dataIndex: "appointment.patient.name",
      key: "appointment.patient.name",
      render: (text, record) => {
        return <span>{record.appointment.patient.name}</span>;
      },
    },
    {
      title: "DoctorName",
      dataIndex: "appointment.doctor.name",
      key: "appointment.doctor.name",
      render: (text, record) => {
        return <span>{record.appointment.doctor?.Auth[0].name}</span>;
      },
    },
    {
      title: "Date/Time",
      dataIndex: "datePrescribed",
      key: "datePrescribed",
      render: (text, record) => {
        return (
          <span>
            {dayjs(record.datePrescribed).format("DD/MM/YYYY hh:mm a")}
          </span>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            onClick={() => {
              ShowPrescriptionHandler(record, "prescription");
            }}
          >
            View Prescriptions
          </Button>
          <Button
            onClick={() => {
              navigate(`/pharmacy/receipt?prescriptionId=${record.id}`);
            }}
          >
            Dispense
          </Button>
          {/* </Popconfirm> */}
        </Space>
      ),
    },
  ];

  const processedColumns = [
    {
      title: "PatientName",
      dataIndex: "appointment.patient.name",
      key: "appointment.patient.name",
      render: (text, record) => {
        return <span>{record.appointment.patient.name}</span>;
      },
    },
    {
      title: "DoctorName",
      dataIndex: "appointment.doctor.name",
      key: "appointment.doctor.name",
      render: (text, record) => {
        return <span>{record.appointment.doctor?.Auth[0].name}</span>;
      },
    },
    {
      title: "Date/Time",
      dataIndex: "datePrescribed",
      key: "datePrescribed",
      render: (text, record) => {
        return (
          <span>
            {dayjs(record.datePrescribed).format("DD/MM/YYYY hh:mm a")}
          </span>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            onClick={() => {
              ShowPrescriptionHandler(record, "prescription");
            }}
          >
            View Prescription
          </Button>
          <Button
            onClick={() => {
              ShowPrescriptionHandler(record, "receipt");
            }}
          >
            Show Receipt
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Tabs defaultActiveKey="1" centered>
        <Tabs.TabPane tab="Active" key="1">
          <Table
            dataSource={pharmacyData.prescriptions.filter(
              (prsp) => prsp.pending
            )}
            columns={pendingColumns}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Completed" key="2">
          <Table
            dataSource={pharmacyData.prescriptions.filter(
              (prsp) => !prsp.pending
            )}
            columns={processedColumns}
          />
        </Tabs.TabPane>
      </Tabs>
      <Drawer
        visible={ModalVisible?.visible}
        onOk={ToggleModal}
        onClose={ToggleModal}
        footer={[
          <Button key="back" onClick={ToggleModal}>
            Close
          </Button>,
        ]}
        width={1000}
      >
        {ModalVisible?.type === "prescription" ? (
          <PrescriptionDisplay
            id={ModalVisible?.data?.appointmentId}
            ExtraMedicines={ModalVisible?.data?.CustomMedicines}
            Medicines={ModalVisible?.data?.medicines}
            date={ModalVisible?.data?.createdAt}
            patient={ModalVisible?.data?.appointment?.patient}
            symptoms={ModalVisible?.data?.symptoms}
          />
        ) : (
          <ShowReceipt
            data={[
              {
                ...ModalVisible?.data,
                date: dayjs(ModalVisible?.data?.datePrescribed).format(
                  "MMMM DD YYYY HH:mm A"
                ),
              },
            ]}
          />
        )}
      </Drawer>
    </React.Fragment>
  );
}

export default Prescriptions;
