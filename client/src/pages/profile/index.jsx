import { Button, Form, Input } from "antd";
import React from "react";

import ProfileWrapper from "../../components/Profile/ProfileWrapper";

const ProfilePage = () => {
  const [form] = Form.useForm();

  const formSubmitHandler = async (values) => {
    console.log({ values });
    // TODO
    // inform admin that the doctor is leaving
  };

  return (
    <ProfileWrapper>
      <h3>Are you leaving ?</h3>
      <br />

      <Form
        form={form}
        onFinish={formSubmitHandler}
        labelAlign="left"
        style={{ width: "50%" }}
      >
        <Form.Item
          label="Reason"
          name="reason"
          style={{ display: "block" }}
          rules={[{ required: true, message: "Reason is required" }]}
        >
          <Input.TextArea placeholder="Enter your reason to leave" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 2 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </ProfileWrapper>
  );
};

export default ProfilePage;
