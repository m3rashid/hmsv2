import { Button, Modal, Space, Table, Tabs, Popconfirm } from "antd";
import React, { useContext } from "react";
import { useRecoilValue } from "recoil";
import { pharmacyState } from "../../atoms/pharmacy";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
const { TabPane } = Tabs;


function Prescriptions() {
  const pharmacyData = useRecoilValue(pharmacyState);
  const navigate = useNavigate();
  const [ModalVisible, setModalVisible] = React.useState({
    visible: false,
    id: null,
    data: {},
  });

  const ToggleModal = () => {
    setModalVisible({
      ...ModalVisible,
      visible: !ModalVisible.visible,
    });
  };

  const pendingColumns = [
    {
      title: "PatientName",
      dataIndex: "appointment.patient.name",
      key: "appointment.patient.name",
      render: (text, record) => {
        return (
          <span>{record.appointment.patient.name}</span>
        )
      }
      // sorter: (a, b) => a.patientname.localeCompare(b.patientname),
    },
    {
      title: "DoctorName",
      dataIndex: "appointment.doctor.name",
      key: "appointment.doctor.name",
      render: (text, record) => {
        return (
          <span>{record.appointment.doctor?.Auth[0].name}</span>
        )
      }
    },
    {
      title: "Date/Time",
      dataIndex: "datePrescribed",
      key: "datePrescribed",
      render: (text, record) => {
        return (
          <span>{dayjs(record.datePrescribed).format("DD/MM/YYYY hh:mm a")}</span>
        )
      }
      // sorter: (a, b) =>
      //   new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            onClick={() => {
              console.log(record);
              setModalVisible({
                visible: true,
                id: record.id,
                data: record,
              });
            }}
          >
            View Prescriptions{" "}
          </Button>
          <Popconfirm
            title="Create a prescription for this appointment?"
            onConfirm={() => {
              navigate(`/pharmacy/receipt?prescriptionId=${record.id}`);
            }}

            okText="Yes"
            cancelText="Cancel"
          >

            <Button>
              {" "}
              Precribe{" "}
            </Button>
          </Popconfirm>
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
        return (
          <span>{record.appointment.patient.name}</span>
        )
      }
      // sorter: (a, b) => a.patientname.localeCompare(b.patientname),
    },
    {
      title: "DoctorName",
      dataIndex: "appointment.doctor.name",
      key: "appointment.doctor.name",
      render: (text, record) => {
        return (
          <span>{record.appointment.doctor?.Auth[0].name}</span>
        )
      }
    },
    {
      title: "Date/Time",
      dataIndex: "datePrescribed",
      key: "datePrescribed",
      render: (text, record) => {
        return (
          <span>{dayjs(record.datePrescribed).format("DD/MM/YYYY hh:mm a")}</span>
        )
      }
      // sorter: (a, b) =>
      //   new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            onClick={() => {
              setModalVisible({
                visible: true,
                id: record.id,
                data: record,
              });
            }}
          >
            View Prescription
          </Button>
          <Button>
            Show Receipt
          </Button>

        </Space>
      ),
    },
  ];




  return (
    <React.Fragment>

      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Pending" key="1">
          <Table dataSource={pharmacyData.prescriptions.filter(prsp => prsp.pending)} columns={pendingColumns} />
        </TabPane>
        <TabPane tab="Processed" key="2">
          <Table dataSource={pharmacyData.prescriptions.filter(prsp => !prsp.pending)} columns={processedColumns} />
        </TabPane>
      </Tabs>

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
          <p>
            <strong>Date and Time: </strong>
            {ModalVisible.data?.date}
          </p>
          <div>
            <h4>
              <strong>Prescription Info </strong>
            </h4>
            <Space direction="vertical" size={3} style={{ padding: "10px" }}>
              <div>
                <strong>Patient Name: </strong>
                {ModalVisible.data?.patientname}
              </div>
              <div>
                <strong>Doctor Name: </strong>
                {ModalVisible.data?.doctorname}
              </div>
              <div>
                <strong>Medicines: </strong>
                {ModalVisible.data?.medicine?.join(", ")}
              </div>
              <div>
                <strong>Custom Medicines: </strong>
                {ModalVisible.data?.CustomMedicines?.join(", ")}
              </div>
            </Space>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
}

export default Prescriptions;
