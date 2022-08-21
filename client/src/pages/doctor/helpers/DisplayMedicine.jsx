import { Space, Typography, Col, Card } from "antd";
import React from "react";
import dayjs from "dayjs";
import SingleMedicine from "./singleMedicine";

function DisplayMedicine({ formData, medicines }) {
  return (
    <React.Fragment>
      <Typography.Title level={4}>Prescription Preview</Typography.Title>
      <Card title="Appointment Details" style={{ background: "transparent" }}>
        <Space direction="vertical">
          <Typography.Text>
            Appointment ID: {formData?.appointmentInfo?.id}
          </Typography.Text>
          <Typography.Text>
            Patient Name: {formData?.appointmentInfo?.patient.name}
          </Typography.Text>
          <Typography.Text>
            Date:{" "}
            {dayjs(formData?.appointmentInfo?.date).format(
              "MMMM DD YYYY HH:mm A"
            )}
          </Typography.Text>
        </Space>
      </Card>
      <Space
        direction="vertical"
        style={{
          marginLeft: 20,
          padding: 20,
          width: "75%",
          borderRadius: 15,
          backgroundColor: "#fff",
        }}
      >
        <Typography.Text type="success">Symptoms:</Typography.Text>
        <Typography.Text>{formData?.symptoms}</Typography.Text>
      </Space>

      <Card title="Medicines" style={{ background: "transparent" }}>
        <Space direction="vertical" size={"large"}>
          {medicines.map((medicine, index) => (
            <SingleMedicine key={index} index={index} medicine={medicine} />
          ))}
        </Space>
      </Card>
      <Card title="Custom Medicines" style={{ background: "transparent" }}>
        {formData?.CustomMedicines}
      </Card>
    </React.Fragment>
  );
}

export default DisplayMedicine;
