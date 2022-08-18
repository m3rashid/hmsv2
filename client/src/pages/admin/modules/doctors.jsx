import React from "react";
import { Button, Table } from "antd";
import { useRecoilState } from "recoil";

import { instance } from "../../../api/instance";
import { adminState } from "../../../atoms/admin";
import { columns, formatForTable } from "./table.helpers";
import CreateUserModal from "../../../components/Modal/CreateUserModal";

const Doctors = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [adminData, setAdminData] = useRecoilState(adminState);

  const getAllDoctors = async () => {
    try {
      if (adminData.doctors.length !== 0) return;

      const res = await instance.post("/admin/all", {
        userRole: "DOCTOR",
      });

      const users = formatForTable(res.data.users);
      console.table(users);
      setAdminData((prev) => ({ ...prev, doctors: users }));
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getAllDoctors().then().catch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ marginTop: "10px", marginLeft: "0px" }}>
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
        dataSource={adminData.doctors}
        columns={columns}
        pagination={{
          total: adminData.doctors.length,
          defaultPageSize: 5,
        }}
      />
    </div>
  );
};

export default Doctors;
