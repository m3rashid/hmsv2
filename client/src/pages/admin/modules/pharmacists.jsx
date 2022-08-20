import React from "react";
import { Table } from "antd";

import { columns } from "./helpers/table";
import useGetUserDetail from "./helpers/getUserDetail";

const Pharmacists = () => {
  const { getAllUsers, users } = useGetUserDetail({
    userType: "pharmacists",
    userRole: "PHARMACIST",
  });

  React.useEffect(() => {
    getAllUsers().then().catch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ marginTop: "10px", marginLeft: "0px" }}>
      <Table
        dataSource={users}
        columns={columns}
        pagination={{
          total: users.length,
          defaultPageSize: 5,
        }}
      />
    </div>
  );
};

export default Pharmacists;
