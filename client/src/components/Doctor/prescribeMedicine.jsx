import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Radio,
  Input,
  InputNumber,
  message,
  Select,
  AutoComplete,
} from "antd";
import { socket } from "../../api/socket";
import FixedUseContext from "../../Hooks/FixedUseContext";
import { DoctorContext } from "../../pages/doctor";
const { TextArea } = Input;
const { Option } = Select;

const PrescriptionForm = () => {
  const [loading, setLoading] = useState(false);

  const { AppointmentsData } = FixedUseContext(DoctorContext);

  const [AppointmentSearch, setAppSearch] = useState(AppointmentsData);
  const formSubmitHandler = (values) => {
    if (loading) return;
    console.log(values);
  };

  return (
    <Form
      onFinish={formSubmitHandler}
      labelAlign="left"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 8 }}
    >
      <Form.Item
        label="Choose Appointment"
        name="appointment"
        rules={[{ required: true, message: "Please Enter patient name!" }]}
      >
        <Select
          style={{
            width: "100%",
          }}
          placeholder="select an appointment"
          defaultValue={[]}
          onChange={() => {
            console.log("changed");
          }}
          optionLabelProp="Appointment"
        >
          {AppointmentSearch.map((appointment) => (
            <Option key={appointment.id} value={appointment.id}>
              <span>
                {appointment.patientname} - {appointment.date}
              </span>
            </Option>
          ))}
        </Select>
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
