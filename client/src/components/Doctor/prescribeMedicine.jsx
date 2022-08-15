import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Form,
  Button,
  // Radio,
  Input,
  // InputNumber,
  message,
  Select,
  Space,
  // AutoComplete,
} from "antd";
// import { socket } from "../../api/socket";
import FixedUseContext from "../../Hooks/FixedUseContext";
import { DoctorContext } from "../../pages/doctor";
import { socket } from "../../api/socket";
import MedicineInput from "./MedicineInput";
const { TextArea } = Input;
const { Option } = Select;

const PrescriptionForm = () => {
  const [loading] = useState(false);

  const { AppointmentsData } = FixedUseContext(DoctorContext);
  const [AppointmentSearch] = useState(AppointmentsData);
  const [medicines, setMedicines] = useState([]);

  const formSubmitHandler = (values) => {
    if (loading) return;
    console.log(values);
    socket.emit("create-prescription-by-doctor", {
      ...values,
      datetime: moment().format("YYYY-MM-DD"),
      medicines,
    });
  };

  const addEmptyMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", quantity: 0, description: "" },
    ]);
  };

  const deleteMedicine = (index) => {
    setMedicines([...medicines.slice(0, index), ...medicines.slice(index + 1)]);
  };

  React.useEffect(() => {
    socket.on("new-prescription-by-doctor-created", ({ data }) => {
      message.success(
        `New Prescription for ${data.prescription.id} created successfully!`
      );
    });

    return () => {
      socket.off("new-prescription-by-doctor-created");
    };
  }, []);

  useEffect(() => {
    console.log(medicines);
  }, [medicines]);

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

      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
      >
        {medicines.map((medicine, index) => (
          <React.Fragment>
            <MedicineInput
              index={index}
              medicine={medicine}
              deleteMedicine={deleteMedicine}
              setMedicines={setMedicines}
            />
          </React.Fragment>
        ))}

        <Button type="primary" htmlType="button" onClick={addEmptyMedicine}>
          + Add New Medicines
        </Button>
      </Space>

      <Form.Item label="Custom Medicines" name="CustomMedicines">
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
