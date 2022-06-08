import React, { useEffect, useState } from "react";
import { Form, Button, Radio, Input, InputNumber, message } from "antd";
import { socket } from "../../../api/socket";
const { TextArea } = Input;

const CreatePatientForm = () => {
  const [loading, setLoading] = useState(false);
  const formSubmitHandler = (values) => {
    if (loading) return;
    setLoading(true);
    socket.emit("create-patient", {
      ...values,
    });
  };
  useEffect(() => {
    socket.on("new-patient-created", ({ data }) => {
      message.success(`Patient ${data.name} created successfully!`);
      setLoading(false);
    });

    return () => {
      socket.off("new-patient-created");
    };
  }, []);

  return (
    <Form
      onFinish={formSubmitHandler}
      labelAlign="left"
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 8 }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please Enter patient name!" }]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item label="Age" name="age">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="Sex"
        name="sex"
        rules={[{ required: true, message: "Please select patient sex!" }]}
      >
        <Radio.Group size="large">
          <Radio.Button value="m">Male</Radio.Button>
          <Radio.Button value="f">Female</Radio.Button>
          <Radio.Button value="o">Other</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="Contact"
        name="contact"
        rules={[{ required: true, message: "Please enter contact info!" }]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item label="Address" name="address">
        <TextArea type="text" />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input type="text" />
      </Form.Item>
      <Form.Item label="Jamia ID" name="jamiaId">
        <Input type="text" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 2 }}>
        <Button loading={loading} type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreatePatientForm;
