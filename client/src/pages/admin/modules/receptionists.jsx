import React from "react";
import { useRecoilState } from "recoil";
import { Button, Table } from "antd";

import { instance } from "../../../api/instance";
import { adminState } from "../../../atoms/admin";
import CreateUserModal from "../../../components/Modal/CreateUserModal";
import { columns, formatForTable } from "./table.helpers";

const Receptionists = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [adminData, setAdminData] = useRecoilState(adminState);

  const getAllReceptionists = async () => {
    try {
      if (adminData.receptionists.length !== 0) return;

      const res = await instance.post("/admin/all", {
        userRole: "RECEPTIONIST",
      });

      const users = formatForTable(res.data.users);
      console.table(users);
      setAdminData((prev) => ({ ...prev, receptionists: users }));
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getAllReceptionists().then().catch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ marginTop: "10px" }}>
      <div>
        <Button
          style={{ marginBottom: "20px" }}
          onClick={() => setIsModalVisible(true)}
        >
          Register Receptionist
        </Button>

        <CreateUserModal
          isModalVisible={isModalVisible}
          handleOk={() => setIsModalVisible(true)}
          handleCancel={() => setIsModalVisible(false)}
          role="RECEPTIONIST"
        />
      </div>

      <Table
        dataSource={adminData.receptionists}
        columns={columns}
        pagination={{
          total: adminData.receptionists.length,
          defaultPageSize: 5,
        }}
      />
    </div>
  );
};

export default Receptionists;
