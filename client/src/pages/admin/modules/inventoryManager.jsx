import React from "react";
import { Table } from "antd";

import { columns } from "./helpers/table";
import useGetUserDetail from "./helpers/getUserDetail";
import AdminWrapper from "../adminWrapper";

const InventoryManagers = () => {
  const { getAllUsers, users, RefreshUserButton } = useGetUserDetail({
    userType: "inventoryManagers",
    userRole: "INVENTORY_MANAGER",
  });

  React.useEffect(() => {
    getAllUsers().then().catch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminWrapper aside={<RefreshUserButton />}>
      <Table
        dataSource={users}
        columns={columns}
        pagination={{
          total: users.length,
          defaultPageSize: 5,
        }}
      />
    </AdminWrapper>
  );
};

export default InventoryManagers;
