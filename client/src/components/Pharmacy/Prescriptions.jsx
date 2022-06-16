import { Button, Space, Table } from "antd";
import React, { useContext } from "react";
import { PharmacyContext } from "../../pages/pharmacy";

function Prescriptions() {
  const { prescription } = useContext(PharmacyContext);

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
    </React.Fragment>
  );
}

export default Prescriptions;
