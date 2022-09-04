import React from "react";
import { Modal, Button, Space, Form, Select, message } from "antd";

import { instance } from "../../../../api/instance";
import { permissions } from "../../../../utils/constants";
import { toSentenceCase } from "../../../../utils/strings";

const UserDetailsModal = ({ data }) => {
  const [editPermissions, setEditPermissions] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const onFinish = async (values) => {
    try {
      message.loading({ content: "Loading...", key: "edit-permissions" });
      await instance.post("/admin/edit-permissions", {
        permissions: values.permissions,
        userId: data.id,
      });

      message.success({
        content: "Permissions edited Successfully",
        key: "edit-permissions",
      });
      closeModal();
    } catch (err) {
      closeModal();
      message.error({
        content: "Permissions editing Failed",
        key: "edit-permissions",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error({
      content: "Permissions editing Failed",
      key: "edit-permissions",
    });
  };

  const ShowEntry = ({ label, value }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "1rem",
      }}
    >
      <p style={{ fontWeight: 800, padding: 0, margin: 0 }}>{label}: </p>
      <p style={{ padding: 0, margin: 0 }}>{value}</p>
    </div>
  );

  return (
    <React.Fragment>
      <Space>
        <Button onClick={openModal}>Details</Button>
      </Space>
      <Modal
        title={data.name + ", " + data.origin}
        visible={isModalVisible}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
      >
        <ShowEntry label="Name" value={data.name} />
        <ShowEntry label="Email" value={data.email} />
        <ShowEntry
          label="Permissions"
          value={data.permissions
            .map((p) => {
              return p
                .split("_")
                .map((s) => toSentenceCase(s))
                .join(" ");
            })
            .join(", ")}
        />

        {data.sex && <ShowEntry label="Gender" value={data.sex} />}
        {data.designation && (
          <ShowEntry label="Designation" value={data.designation} />
        )}
        {data.origin && <ShowEntry label="Origin" value={data.origin} />}
        {data.bio && <ShowEntry label="Bio" value={data.bio} />}
        <br />
        {data.address && <ShowEntry label="Address" value={data.address} />}
        {data.authorityName && (
          <ShowEntry label="Authority Name" value={data.authorityName} />
        )}
        {data.availability.length > 0 && (
          <ShowEntry
            label="Availability"
            value={data.availability.join(" - ")}
          />
        )}
        {data.availableDays.length > 0 && (
          <ShowEntry
            label="Available Days"
            value={data.availableDays.join(" - ")}
          />
        )}
        {data.category && <ShowEntry label="Category" value={data.category} />}
        {data.contact && <ShowEntry label="Contact" value={data.contact} />}
        {data.joined && <ShowEntry label="Joined" value={data.joined} />}
        {data.role && <ShowEntry label="Role" value={data.role} />}

        <div style={{ marginTop: 10 }}>
          {editPermissions ? (
            <Form
              style={{ marginTop: 20 }}
              name={`Edit User Permissions: ${data.name}`}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                key="permissions"
                name="permissions"
                label="Permissions"
              >
                <Select
                  placeholder="Select permissions"
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  defaultValue={data.permissions}
                >
                  {permissions.map((p, i) => (
                    <Select.Option key={`${p}-${i}`} value={p}>
                      {p
                        .split("_")
                        .map((s) => toSentenceCase(s))
                        .join(" ")}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  margin: "0px -24px -10px -24px",
                  padding: "0px 24px 0 24px",
                }}
              >
                <Button
                  style={{ marginRight: "10px" }}
                  onClick={() => setEditPermissions(false)}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Set new Permissions
                </Button>
              </div>
            </Form>
          ) : (
            <Button
              style={{ width: "100%" }}
              onClick={() => setEditPermissions(true)}
            >
              Edit User Permissions
            </Button>
          )}
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default UserDetailsModal;
