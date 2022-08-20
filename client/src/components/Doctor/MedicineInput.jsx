import {
  AutoComplete,
  Button,
  Col,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./medicineinput.module.css";
import { instance } from "../../api/instance";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { inventoryState } from "../../atoms/inventory";
const { Option, OptGroup } = Select;

function MedicineInput({ index, medicine, deleteMedicine, setMedicines }) {
  const dosages = [
    {
      value: "OD",
      label: "Once a day",
    },
    {
      value: "BD",
      label: "Twice a day",
    },
    {
      value: "TD",
      label: "Three times a day",
    },
    {
      value: "QD",
      label: "Four times a day",
    },
    {
      value: "OW",
      label: "Once a week",
    },
    {
      value: "BW",
      label: "Twice a week",
    },
    {
      value: "TW",
      label: "Three times a week",
    },
  ];

  const medicineDB = useRecoilValue(inventoryState);
  console.log(medicine);

  const handleChange = (value, type) => {
    console.log(`${type} ${value}`);

    //   Update the medicine object

    setMedicines((prevState) => {
      return prevState.map((medicine, i) => {
        if (i === index) {
          return {
            ...medicine,
            [type]: value,
          };
        }
        return medicine;
      });
    });
  };

  return (
    <Space
      direction="vertical"
      style={{
        width: "90%",
        marginLeft: 20,
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
        <Space
          size={"middle"}
          style={{
            width: "100%",
          }}
        >
          <Typography.Text>Meidcine :</Typography.Text>
          <Select
            style={{
              width: 300,
            }}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => option.children?.includes(input)}
            filterSort={(optionA, optionB) =>
              optionA.children
                ?.toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
            placeholder="Select medicine"
            onChange={(value) => {
              const Item = medicineDB?.Medicine?.inventory.find(
                (item) => item.id === value
              );
              handleChange(Item, "medicine");
            }}
          >
          <OptGroup label="Tablets">
              {medicineDB.Medicine?.inventory.filter(m=>m.medType==="TABLET").map((medicine) => {
                return <Option value={medicine.id}>{medicine.name}</Option>;
              })}
            </OptGroup>
            <OptGroup label="Syrups">
              {medicineDB.Medicine?.inventory.filter(m=>m.medType==="SYRUP").map((medicine) => {
                return <Option value={medicine.id}>{medicine.name}</Option>;
              })}
            </OptGroup>
            {/* <OptGroup label="Non Medicine">
            {medicineDB.NonMedicine?.inventory.map((item) => {
              return (
                <Option value={item.id}>{item.name}</Option>
              );
            }
            )}
          </OptGroup> */}
          </Select>
          <Typography.Text type="danger">
            {medicine?.medicine?.quantity} left!
          </Typography.Text>
        </Space>
        <Space
          style={{
            width: "100%",
            display: "flex",
          }}
        >
          <Typography>Dosage :</Typography>
          <Select
            style={{ width: 200, flexGrow: 1 }}
            placeholder="Select Dosage"
            defaultValue={medicine.dosage}
            className={styles.select}
            onChange={(value) => {
              const Item = dosages.find((item) => item.value === value);
              handleChange(Item, "dosage");
            }}
          >
            {dosages.map((dosage) => (
              <Select.Option value={dosage.value}>{dosage.label}</Select.Option>
            ))}
          </Select>
        </Space>
        {
          medicine.medType === 'SYRUP' &&
          <Space
            style={{
              width: "100%",
              display: "flex",
            }}
          >
            <Typography>Dosage Amount :</Typography>
            <Input
              type="number"
              min={0}
              onChange={(e) => handleChange(e.target.value, "dosageAmount")}
              value={medicine.dosageAmount}
              addonAfter={"ml"}
            />
          </Space>
        }

        <Space
          style={{
            width: "100%",
          }}
        >
          <Typography>Duration : </Typography>
          <Input
            type={"number"}
            placeholder="Enter duration"
            defaultValue={medicine.duration}
            className={styles.input}
            onChange={(e) => handleChange(e.target.value, "duration")}
            addonAfter={"days"}
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
  setMedicines: PropTypes.func.isRequired,
};

export default MedicineInput;
