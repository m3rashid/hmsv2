import { Button, Modal, Space, Table } from "antd";
import React, { useContext } from "react";
import { PharmacyContext } from "../../pages/pharmacy";

function Prescriptions() {
  const { prescription } = useContext(PharmacyContext);
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

  const columns = [
    {
      title: "PatientName",
      dataIndex: "patientname",
      key: "patientname",
      // sorter: (a, b) => a.patientname.localeCompare(b.patientname),
    },
    {
      title: "DoctorName",
      dataIndex: "doctorname",
      key: "doctorname",
    },
    {
      title: "Date/Time",
      dataIndex: "date",
      key: "date",
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
        </Space>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Table dataSource={prescription} columns={columns} />
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
            <Space
              direction="vertical"
              size={3}
              style={{
                padding: "10px",
              }}
            >
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
