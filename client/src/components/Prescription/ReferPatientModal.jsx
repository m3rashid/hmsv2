import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  message,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";

import { instance } from "../../api/instance";
import DoctorSelector from "../Doctor/DoctorSelector";
import DoctorDisplay from "../Doctor/DoctorDisplay";
import DoctorTimeSelector from "../Reception/TimeSelector";

const ReferPatientModal = ({
  patientId,
  doctorId,
  modalState,
  setModalState,
}) => {
  const closeModal = () => setModalState(false);
  const [formData, setformData] = useState({});
  // TODO: use this with sockets
  const onFinish = async () => {
    try {
      message.loading({ content: "Loading...", key: "refer-patient" });

      await instance.post("/doctor/refer", {
        date: formData?.date,
        nextDoctorId: formData?.doctor?.id,
        patientId,
        prevDoctorId: doctorId,
      });
      message.success({
        content: "Refer Patient Success",
        key: "refer-patient",
      });
      closeModal();
    } catch (error) {
      message.error({
        content: "Refer Patient Failed",
        key: "auth/createUser",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error({
      content: "Refer Patient Failed",
      key: "refer-patient",
    });
  };

  return (
    <React.Fragment>
      <Modal
        title="Refer Patient"
        visible={modalState}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
        width={"60%"}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form
              style={{ marginTop: 20 }}
              name={"Refer to another Doctor"}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="horizontal"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 14 }}
            >
              <Space
                direction="vertical"
                style={{
                  width: "100%",
                }}
              >
                <DoctorSelector
                  onChange={(value) =>
                    setformData({ ...formData, doctor: value })
                  }
                  style={{
                    width: "100%",
                  }}
                />

                <DoctorTimeSelector
                  onChange={(value) =>
                    setformData({ ...formData, date: value })
                  }
                  doctor={formData.doctor}
                  style={{
                    width: "100%",
                  }}
                />
              </Space>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  borderTop: "1px solid #f0f0f0",
                  margin: "24px -24px -10px -24px",
                  padding: "10px 24px 0 24px",
                }}
              >
                <Button style={{ marginRight: "10px" }} onClick={closeModal}>
                  Cancel
                </Button>

                <Button type="primary" htmlType="submit">
                  Refer patient to this doctor
                </Button>
              </div>
            </Form>
          </Col>
          <Col span={12}>
            <Typography.Text
              strong
              style={{
                marginTop: 20,
              }}
            >
              Doctor Details
            </Typography.Text>
            <DoctorDisplay doctor={formData?.doctor?.profile} />
          </Col>
        </Row>
      </Modal>
    </React.Fragment>
  );
};

export default ReferPatientModal;
