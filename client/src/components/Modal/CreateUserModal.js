import React from "react";
import { Modal, Button, Input, Form, message } from "antd";
import { instance } from "../../api/instance";

function CreateUserModal(props) {
  const RoleName = props.role[0] + props.role.toLowerCase().slice(1);
  console.log(RoleName);
  const onFinish = async (values) => {
    try {
      message.loading({
        content: "Loading...",
        key: "auth/createUser",
      });

      const createdUser = {
        ...values,
        role: `${props.role}`,
      };

      console.log(createdUser);
      const { data } = await instance.post("/auth/createUser", createdUser);
      console.log(data);
      message.success({
        content: `${RoleName} created Successfully`,
        key: "auth/createUser",
      });
      props.handleCancel();
    } catch (error) {
      message.error({
        content: `${RoleName} creation Failed`,
        key: "auth/createUser",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error({
      content: `${RoleName} Creation Failed`,
      key: "auth/createUser",
    });
  };

  return (
    <React.Fragment>
      <Modal
        title="Create"
        visible={props.isModalVisible}
        onOk={props.handleOk}
        onCancel={props.handleCancel}
        footer={null}
      >
        <Form
          name="Create User"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            rules={[{ required: true, message: "Please enter a username!" }]}
            name="name"
            label="Name"
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Please enter an email!" }]}
            name="email"
            label="Email"
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              borderTop: "1px solid #f0f0f0",
              margin: "24px -24px -10px -24px",
              padding: "10px 24px 0 24px",
            }}
          >
            <Button
              style={{ marginRight: "10px" }}
              onClick={props.handleCancel}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create User
            </Button>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
}

export default CreateUserModal;
