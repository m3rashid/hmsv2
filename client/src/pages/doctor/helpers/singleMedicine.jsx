import React from "react";
import { Alert, Space, Typography } from "antd";

const SingleMedicine = ({ index, medicine, isExtra }) => {
  console.log(medicine);
  return (
    <Space direction="vertical" key={index} style={{ marginLeft: 20 }}>
      <Space>
        <Typography.Text style={{ fontWeight: "bold" }}>
          {medicine?.Medicine?.name}
        </Typography.Text>
        <Typography.Text
          style={{
            padding: "5px 10px",
            borderRadius: 5,
            fontSize: "12px",
            backgroundColor: "#ff4d4f",
            color: "#fff",
            display: isExtra ? "none" : "block",
          }}
        >
          # {medicine?.Medicine?.id}
        </Typography.Text>
      </Space>
      <Space direction="vertical" style={{ padding: "10px" }}>
        <Typography.Text>
          Duration : <strong>{medicine?.duration} Days</strong>
        </Typography.Text>
        <Typography.Text>
          Dosage : <strong>{medicine?.dosage}</strong>
        </Typography.Text>
        {medicine?.quantityRequired && (
          <React.Fragment>
            <Typography.Text>
              Quantity Required :<strong>{medicine?.quantityRequired}</strong>
            </Typography.Text>
            <Alert
              message="Required Quantity Not Available"
              type="error"
              style={{
                display: medicine?.available || isExtra ? "none" : "block",
              }}
            />
          </React.Fragment>
        )}
        <Typography.Text>{medicine?.description}</Typography.Text>
      </Space>
    </Space>
  );
};

export default SingleMedicine;
