import faker from "@faker-js/faker";
import React from "react";
import { Button, Input, Space, Table } from "antd";
import CreateUserModal from "../../../components/Modal/CreateUserModal";

// const { TextArea } = Input;

const GenerateData = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      name: faker.name.findName(),
      designation: faker.name.jobTitle(),
      joined: faker.date.past().toDateString(),
    });
  }
  return data;
};

const Doctors = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Joined",
      dataIndex: "joined",
      key: "joined",
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button> Details </Button>
        </Space>
      ),
    },
  ];

  const data = GenerateData(10);

  return (
    <div
      style={{
        marginTop: "10px",
        marginLeft: "0px",
      }}
    >
      <div>
        <Button
          style={{ marginBottom: "20px" }}
          onClick={() => setIsModalVisible(true)}
        >
          Register Doctor
        </Button>

        <Button
          style={{ marginBottom: "20px" }}
          onClick={() => setIsModalVisible(true)}
        >
          Register Doctor
        </Button>

        <CreateUserModal
          isModalVisible={isModalVisible}
          handleOk={() => {
            setIsModalVisible(true);
          }}
          handleCancel={() => {
            setIsModalVisible(false);
          }}
          role="DOCTOR"
        />
      </div>
      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          total: data.length,
          defaultPageSize: 5,
        }}
      />
    </div>
  );
};

export default Doctors;
