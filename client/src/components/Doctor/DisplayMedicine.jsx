import React from "react";
import dayjs from "dayjs";
import { Space, Typography, Card } from "antd";
import PropTypes from "prop-types";
import SingleMedicine from "../../pages/doctor/helpers/singleMedicine";

function DisplayMedicine({
  patient,
  date,
  id,
  symptoms,
  Medicines,
  ExtraMedicines,
}) {
  return (
    <React.Fragment>
      <Typography.Title level={4}>Prescription Preview</Typography.Title>
      <Card title="Appointment Details" style={{ background: "transparent" }}>
        <Space direction="vertical">
          <Typography.Text>Appointment ID: {id}</Typography.Text>
          <Typography.Text>Patient Name: {patient?.name}</Typography.Text>
          <Typography.Text>
            Date: {dayjs(date).format("MMMM DD YYYY HH:mm A")}
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
        <Typography.Text>{symptoms}</Typography.Text>
      </Space>

      <Card title="Medicines" style={{ background: "transparent" }}>
        <Space direction="vertical" size={"large"}>
          {Medicines?.map((medicine, index) => (
            <SingleMedicine key={index} index={index} medicine={medicine} />
          ))}
        </Space>
      </Card>
      <Card title="Custom Medicines" style={{ background: "transparent" }}>
        <Space direction="vertical" size={"large"}>
          {ExtraMedicines?.map((medicine, index) => (
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
  patient: PropTypes.object,
  date: PropTypes.string,
  id: PropTypes.any,
  symptoms: PropTypes.string,
  Medicines: PropTypes.array,
  ExtraMedicines: PropTypes.array,
};

export default DisplayMedicine;
