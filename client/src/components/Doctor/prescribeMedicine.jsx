import React, { useEffect, useState } from "react";
import { Form, Button, Radio, Input, InputNumber, message, Select } from "antd";
import { socket } from "../../api/socket";
const { TextArea } = Input;
const { Option } = Select;

const PrescriptionForm = () => {
  const [loading, setLoading] = useState(false);
  const formSubmitHandler = (values) => {
    if (loading) return;
    setLoading(true);
    socket.emit("create-patient", {
      ...values,
    });
  };
  useEffect(() => {
    socket.on("new-patient-created", (data) => {
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
      labelCol={{ span: 3 }}
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
      <Form.Item label="Symptoms" name="symptoms">
        <TextArea type="text" />
      </Form.Item>
      <Form.Item label="Prescription" name="prescription">
        <Select
          mode="multiple"
          style={{
            width: "100%",
          }}
          placeholder="select a medicine"
          defaultValue={["diclo"]}
          onChange={() => {
            console.log("changed");
          }}
          optionLabelProp="label"
        >
          <Option value="diclo" label="Diclo">
            <div className="demo-option-label-item">
              <span role="img" aria-label="Diclo">
                💊&nbsp;
              </span>
              Diclo
            </div>
          </Option>
          <Option value="aspirin" label="Aspirin">
            <div className="demo-option-label-item">
              <span role="img" aria-label="Aspirin">
                💊&nbsp;
              </span>
              Aspirin
            </div>
          </Option>
          <Option value="amlokind-5" label="Amlokind-5">
            <div className="demo-option-label-item">
              <span role="img" aria-label="Amlokind-5">
                💊&nbsp;
              </span>
              Amlokind-5
            </div>
          </Option>
          <Option value="urimax-500" label="Urimax-500">
            <div className="demo-option-label-item">
              <span role="img" aria-label="Urimax-500">
                💊&nbsp;
              </span>
              Urimax-500
            </div>
          </Option>
        </Select>
      </Form.Item>
      <Form.Item label="Custom Medicines" name="Custom Medicines">
        <TextArea type="text" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 3 }}>
        <Button loading={loading} type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PrescriptionForm;
