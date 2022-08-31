import React from "react";
import dayjs from "dayjs";
import { Space, Typography, Card } from "antd";
import PropTypes from "prop-types";
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
          {medicines.medicines?.map((medicine, index) => (
            <SingleMedicine key={index} index={index} medicine={medicine} />
          ))}
        </Space>
      </Card>
      <Card title="Custom Medicines" style={{ background: "transparent" }}>
        <Space direction="vertical" size={"large"}>
          {medicines.extramedicines?.map((medicine, index) => (
            <SingleMedicine
              key={index}
              index={index}
              medicine={medicine}
              isExtra={true}
            />
          ))}
        </Space>
      </Card>
    </React.Fragment>
  );
}

DisplayMedicine.propTypes = {
  formData: PropTypes.shape({
    appointmentInfo: PropTypes.shape({
      id: PropTypes.string,
      date: PropTypes.string,
      patient: PropTypes.object,
    }),
    symptoms: PropTypes.string,
    medicines: PropTypes.shape({
      medicines: PropTypes.array,
      extramedicines: PropTypes.array,
    }),
  }),
};

export default DisplayMedicine;
