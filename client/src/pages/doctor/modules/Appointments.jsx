import React, { useContext, useEffect, useState } from "react";
import { socket } from "../../../api/socket";
import { useRecoilValue } from "recoil";
import { authState } from "../../../atoms/auth";
import { Button, Space, Table } from "antd";
import { DoctorContext } from "..";

function Appointments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useRecoilValue(authState);

  useEffect(() => {
    socket.emit("get-doctor-appointments", {
      doctorId: user.id,
    });
  }, [user.id]);

  const { AppointmentsData } = useContext(DoctorContext);

  useEffect(() => {
    console.log(AppointmentsData);
  }, []);

  useEffect(() => {
    socket.on("found-doctor-appointments", (data) => {
      const { doctorId, appointments } = data;
      console.log(appointments);
      setData(appointments);
      setLoading(false);
    });
    return () => {
      socket.off("found-doctor-appointments");
    };
  }, []);
  const columns = [
    {
      title: "PatientName",
      dataIndex: "patientname",
      key: "patientname",
      sorter: (a, b) => a.patientname.localeCompare(b.patientname),
    },
    {
      title: "Date/Time",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button> View Form </Button>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        marginTop: "20px",
      }}
    >
      <Table
        dataSource={AppointmentsData}
        columns={columns}
        pagination={{
          total: data.length,
          defaultPageSize: 5,
        }}
      />
    </div>
  );
}

export default Appointments;
