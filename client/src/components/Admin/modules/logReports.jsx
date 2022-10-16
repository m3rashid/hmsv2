import dayjs from "dayjs";
import React from "react";
import { Button, Modal, Table } from "antd";

import AdminWrapper from "../adminWrapper";
import useLogReports from "./helpers/useLogReports";
import { toSentenceCase } from "../../../utils/strings";
import ShowEntry from "../../../components/common/showEntry";

const LogReports = () => {
  const {
    getLogs,
    allLogs,
    getDetails,
    handleCancel,
    handleOk,
    isModalVisible,
    details,
    refreshLogs,
  } = useLogReports();

  React.useEffect(() => {
    getLogs().then().catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) =>
        text
          .split("_")
          .map((e) => toSentenceCase(e))
          .join(" "),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Button onClick={() => getDetails(record)}>Details</Button>
      ),
    },
  ];

  if (Object.keys(allLogs).length === 0) {
    return <AdminWrapper>No data</AdminWrapper>;
  }

  return (
    <AdminWrapper
      aside={
        <Button onClick={refreshLogs} style={{ marginBottom: "10px" }}>
          Refresh Log Reports
        </Button>
      }
    >
      <Table
        dataSource={allLogs}
        columns={columns}
        pagination={{
          total: allLogs.length,
          defaultPageSize: 10,
        }}
      />
      <Modal
        title="Details"
        footer={null}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {Object.keys(details.action).length > 0 &&
        Object.keys(details.doneBy).length > 0 ? (
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <h3>Done By</h3>
            <ShowEntry label="Name" value={details.doneBy["Auth"][0].name} />
            <ShowEntry label="Email" value={details.doneBy["Auth"][0].email} />
            <ShowEntry
              label="Time"
              value={dayjs(details.action.updatedAt).format(
                "DD-MM-YYYY hh:mm A"
              )}
            />
            <ShowEntry label="Role" value={details.doneBy.role} />

            <br />

            <h3>Action Details</h3>
            <pre>{JSON.stringify(details.actionToShow, null, 2)}</pre>
          </div>
        ) : (
          <div>Details Loading</div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #f0f0f0",
            margin: "24px -24px -10px -24px",
            padding: "10px 24px 0 24px",
          }}
        >
          <Button style={{ marginRight: "10px" }} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            OK
          </Button>
        </div>
      </Modal>
    </AdminWrapper>
  );
};

export default LogReports;
