import React, { useEffect } from "react";
import {
  Form,
  Button,
  Radio,
  Input,
  InputNumber,
  message,
  Typography,
} from "antd";
import { socket } from "../../api/socket";
import { showGender } from "../../utils/strings";
import { useRecoilState } from "recoil";
import { LoadingAtom } from "../../atoms/loading";
const { TextArea } = Input;

const CreatePatientForm = () => {
  const [LoadingData, setLoadingData] = useRecoilState(LoadingAtom);
  const [from] = Form.useForm();
  const formSubmitHandler = (values) => {
    if (LoadingData?.CreatePatientForm) return;
    setLoadingData({
      CreatePatientForm: true,
    });
    socket.emit("create-patient", { ...values });
    from.resetFields();
  };

  useEffect(() => {
    socket.on("new-patient-created", ({ data }) => {
      message.success(`Patient ${data.name} created successfully!`);
      setLoadingData({
        CreatePatientForm: false,
      });
    });

    return () => {
      socket.off("new-patient-created");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Typography.Title level={2} style={{ paddingLeft: 45 }}>
        Create Patient
      </Typography.Title>
      <Form
        onFinish={formSubmitHandler}
        form={from}
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        style={{ paddingLeft: 20 }}
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
            {["m", "f", "o"].map((gender, i) => (
              <Radio.Button key={gender} value={gender}>
                {showGender(gender)}
              </Radio.Button>
            ))}
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
          <Button
            loading={LoadingData?.CreatePatientForm}
            type="primary"
            htmlType="submit"
          >
            Register Patient
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

export default CreatePatientForm;
