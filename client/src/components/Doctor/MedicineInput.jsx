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

function MedicineInput({ index, medicine, deleteMedicine, setMedicines }) {
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

  const [MedicineList, setMedicineList] = useState({
    list: [],
    cancelToken: undefined,
  });

  const handleChange = (value, type) => {
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

  const UpdateMedicineList = async (value) => {
    if (MedicineList.cancelToken) {
      MedicineList.cancelToken.cancel();
    }

    try {
      const CancelToken = axios.CancelToken.source();

      setMedicineList({
        data: [
          {
            value: "",
            label: "Loading..",
          },
        ],
        cancelToken: CancelToken,
      });

      const { data } = await instance.get(
        "/inventory/search",
        {
          params: {
            name: value,
          },
        },
        {
          cancelToken: CancelToken.token,
        }
      );
      console.log(data);

      setMedicineList({
        ...MedicineList,
        list: data.inventory.map((medicine) => {
          return {
            value: medicine.id,
            data: medicine,
            label: (
              <Col
                direction="vertical"
                size={"small"}
                style={{
                  fontSize: 12,
                }}
              >
                <Row>
                  <Typography.Text>{medicine.name}</Typography.Text>
                  <Typography.Text type="danger">
                    {"("}
                    {medicine.quantity} Left Only
                    {")"}
                  </Typography.Text>
                </Row>
                <Row>
                  <Typography.Text disabled>₹ {medicine.price}</Typography.Text>
                </Row>
              </Col>
            ),
          };
        }),
        cancelToken: MedicineList.cancelToken
          ? MedicineList.cancelToken
          : CancelToken,
      });
    } catch (err) {
      console.log(err);
    }
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
        <AutoComplete
          style={{ width: "100%" }}
          onSearch={UpdateMedicineList}
          placeholder="input here"
          options={MedicineList.list}
          onChange={(value) => handleChange(value, "name")}
        />
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
            onChange={(value) => handleChange(value, "dosage")}
          >
            {dosages.map((dosage) => (
              <Select.Option value={dosage}>{dosage}</Select.Option>
            ))}
          </Select>
        </Space>
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
  setMedicines: PropTypes.func.isRequired,
};

export default MedicineInput;
