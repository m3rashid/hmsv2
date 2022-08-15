import { Button, Input, Select, Space, Typography } from "antd";
import React from "react";
import PropTypes from "prop-types";
import styles from "./medicineinput.module.css";

function MedicineInput({ index, medicine, deleteMedicine }) {
  const dosages = [
    "Once a day",
    "Twice a day",
    "Thrice a day",
    "Four times a day",
  ];

  const medicines = [
    "Paracetamol",
    "Crocin",
    "Ibuprofen",
    "Vitamin C",
    "Vitamin D",
  ];

  const handleChange = (value, type) => {
    //   Update the medicine object
  };

  return (
    <Space
      direction="vertical"
      style={{
        width: "75%",
      }}
      size="middle"
    >
      <div className={styles.header}>
        <Typography>
          <span>Medicine {index + 1}</span>
        </Typography>
        <Button type="dashed" danger onClick={() => deleteMedicine(index)}>
          Delete
        </Button>
      </div>

      <div className={styles.container}>
        <Select
          placeholder="Select Medicine"
          defaultValue={medicine.medicine}
          className={styles.select}
          onChange={(value) => handleChange(value, "medicine")}
        >
          {medicines.map((medicine) => (
            <Select.Option value={medicine}>{medicine}</Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Select Dosage"
          defaultValue={medicine.dosage}
          className={styles.select}
          onChange={(value) => handleChange(value, "dosage")}
        >
          {dosages.map((dosage) => (
            <Select.Option value={dosage}>{dosage}</Select.Option>
          ))}
        </Select>
        <Space
          style={{
            width: "100%",
          }}
        >
          <Typography>Quantity : </Typography>
          <Input
            type={"number"}
            placeholder="Enter Quantity"
            defaultValue={medicine.quantity}
            className={styles.input}
            onChange={(e) => handleChange(e.target.value, "quantity")}
          />
        </Space>
        <div className={styles.description}>
          <Typography
            style={{
              width: 150,
            }}
          >
            Description :
          </Typography>
          <Input.TextArea
            className={styles.textarea}
            defaultValue={medicine.description}
            onChange={(e) => handleChange(e.target.value, "description")}
          />
        </div>
      </div>
    </Space>
  );
}

MedicineInput.propTypes = {
  index: PropTypes.number.isRequired,
  medicine: PropTypes.object.isRequired,
  deleteMedicine: PropTypes.func.isRequired,
};

export default MedicineInput;
