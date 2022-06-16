import {
  // AutoComplete,
  Button,
  // Col,
  Form,
  Input,
  InputNumber,
  notification,
  // Row,
  Select,
  Space,
  // Typography,
} from "antd";
import React, { useState } from "react";
import FixedUseContext from "../../Hooks/FixedUseContext";
import { PharmacyContext } from "../../pages/pharmacy";
const { TextArea } = Input;
const { Option } = Select;

function CreateReceipts() {
  const [loading, setLoading] = useState(false);
  const { prescription, getMedicine, reduceMedicine } =
    FixedUseContext(PharmacyContext);
  const [SelectedPrescription, setSelectedPrescription] = useState(null);
  const [form] = Form.useForm();

  const [total, setTotal] = useState({});
  const formSubmitHandler = (values) => {
    if (loading) return;
    console.log(values, total);

    Object.keys(total).forEach((tot) => {
      reduceMedicine(total[tot].name, total[tot].qty);
    });

    notification.open({
      message: "Reciept Created Successfully",
      description: `Receipt for ${SelectedPrescription.patientname} has been created`,
    });

    setTotal({});
    setSelectedPrescription(null);

    form.resetFields();
  };

  function sum(arr) {
    return arr.reduce((x, y) => x + y, 0);
  }

  return (
    <div>
      <Form
        form={form}
        onFinish={formSubmitHandler}
        labelAlign="left"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 8 }}
      >
        <Form.Item
          label="Choose Prescription"
          name="appointment"
          rules={[{ required: true, message: "Please Enter patient name!" }]}
        >
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select an Prescription"
            defaultValue={[]}
            onSelect={(id) => {
              const pres = prescription.find((value) => value.id === id);
              setSelectedPrescription(pres);
            }}
            optionLabelProp="Appointment"
          >
            {prescription?.map((appointment) => (
              <Option key={appointment.id} value={appointment.id}>
                <span>
                  {appointment.patientname} - {appointment.date}
                </span>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <h3>Medicine</h3>
        {SelectedPrescription
          ? SelectedPrescription?.medicine?.map((item) => (
              <Form.Item label={`${item}`} value={`${item}`}>
                <Space>
                  <InputNumber
                    placeholder="Qty"
                    max={getMedicine(item)[0].qty}
                    min={0}
                    onChange={(value) => {
                      console.log(
                        item,
                        " : ",
                        value,
                        getMedicine(item)[0].price
                      );
                      setTotal((tot) => {
                        const newtot = { ...tot };

                        newtot[item] = {
                          price: getMedicine(item)[0].price * value,
                          qty: value,
                          name: item,
                        };

                        return newtot;
                      });
                    }}
                  />
                  <span
                    style={{
                      padding: "10",
                    }}
                  >
                    max. {getMedicine(item)[0].qty}
                  </span>
                </Space>
              </Form.Item>
            ))
          : null}
        {/* <Form.Item label="Custom Medicines" name="Custom Medicines">
          <TextArea type="text" />
        </Form.Item> */}

        <Form.Item wrapperCol={{ offset: 11 }}>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            Price : ₹&nbsp;
            {sum(Object.keys(total).map((val) => parseInt(total[val].price)))}
          </div>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 12 }}>
          <Button loading={loading} type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateReceipts;
