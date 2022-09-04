import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { Alert, Button, Input, Select, Space, Typography } from "antd";
import { useDebounce } from "use-debounce";

import styles from "./medicineinput.module.css";
import { inventoryState } from "../../atoms/inventory";
import { instance } from "../../api/instance";
import { dosages } from "../../utils/constants";

const MedicineInput = ({
  index,
  medicine,
  deleteMedicine,
  type: medicineType,
  UpdateMedicine,
  isExtra,
}) => {
  const medicineDB = useRecoilValue(inventoryState);
  console.log(medicineDB);
  const [MedicineData, setMedicineData] = useState(medicine);
  const [Info, setInfo] = useState({
    available: true,
    quantityRequired: 0,
    medicine: {},
  });

  const [value] = useDebounce(MedicineData, 500);

  const handleChange = useCallback(
    (value, type) => {
      setMedicineData({
        ...MedicineData,
        [type]: value,
      });
    },
    [MedicineData]
  );

  const ValidateMedicine = useCallback(async () => {
    if (value) {
      const data = {
        dosage: value.dosage,
        medicineId: value?.Medicine?.id,
        duration: parseInt(value.duration),
      };

      if (data.dosage === "" || data.duration === 0 || !data?.medicineId)
        return;

      const { data: availabilityInfo } = await instance.post(
        "/doctor/med/check-availability",
        data
      );
      setInfo(availabilityInfo);
    }
  }, [value]);

  useEffect(() => {
    ValidateMedicine();
  }, [ValidateMedicine]);

  useEffect(() => {
    UpdateMedicine(medicineType, { ...value, ...Info }, index);
  }, [value, Info, UpdateMedicine, medicineType, index]);

  return (
    <Space
      direction="vertical"
      style={{ width: "90%", padding: "0 5px 5px 5px" }}
      size="middle"
    >
      <div className={styles.header}>
        <Typography>
          <span>Medicine {index + 1}</span>
        </Typography>
        <Button
          type="dashed"
          danger
          onClick={() => deleteMedicine(index, medicineType)}
        >
          Delete
        </Button>
      </div>

      <div className={styles.container}>
        <Space size={"middle"} style={{ width: "100%" }}>
          <Typography.Text>Medicine :</Typography.Text>
          <Select
            style={{ width: 300 }}
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
              handleChange(Item, "Medicine");
            }}
          >
            <Select.OptGroup label="Tablets">
              {medicineDB.Medicine?.inventory
                ?.filter((m) => m.medType === "TABLET")
                .map((medicine) => {
                  return (
                    <Select.Option key={medicine.id} value={medicine.id}>
                      {medicine.name}
                    </Select.Option>
                  );
                })}
            </Select.OptGroup>

            <Select.OptGroup label="Syrups">
              {medicineDB.Medicine?.inventory
                ?.filter((m) => m.medType === "SYRUP")
                .map((medicine) => {
                  return (
                    <Select.Option key={medicine.id} value={medicine.id}>
                      {medicine.name}
                    </Select.Option>
                  );
                })}
            </Select.OptGroup>
          </Select>

          {!isExtra && (
            <Typography.Text type="danger">
              {medicine?.medicine?.quantity} left!
            </Typography.Text>
          )}
        </Space>

        <Space style={{ width: "100%", display: "flex" }}>
          <Typography>Dosage :</Typography>
          <Select
            style={{ width: 200, flexGrow: 1 }}
            placeholder="Select Dosage"
            defaultValue={medicine.dosage}
            className={styles.select}
            onChange={(value) => {
              handleChange(value, "dosage");
            }}
          >
            {dosages.map((dosage) => (
              <Select.Option key={dosage.value} value={dosage.value}>
                {dosage.label}
              </Select.Option>
            ))}
          </Select>
        </Space>
        {medicine?.medicine?.medType === "SYRUP" && (
          <Space style={{ width: "100%", display: "flex" }}>
            <Typography>Dosage Amount :</Typography>
            <Input
              type="number"
              min={0}
              onChange={(e) => handleChange(e.target.value, "dosageAmount")}
              value={medicine.dosageAmount}
              addonAfter={"ml"}
            />
          </Space>
        )}

        <Space style={{ width: "100%" }}>
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
          <Typography style={{ width: 150 }}>Description :</Typography>
          <Input.TextArea
            className={styles.textarea}
            defaultValue={medicine.description}
            onChange={(e) => handleChange(e.target.value, "description")}
          />
        </div>
        <Space>
          <Alert
            style={{
              display: Info?.available || isExtra ? "none" : "block",
            }}
            message="Required quantity is not available"
            description="Required Quantity is More than Available Quantity in Stock!"
            type="error"
          ></Alert>
        </Space>
      </div>
    </Space>
  );
};

MedicineInput.propTypes = {
  index: PropTypes.number.isRequired,
  medicine: PropTypes.object.isRequired,
  deleteMedicine: PropTypes.func.isRequired,
  setMedicines: PropTypes.func.isRequired,
};

export default MedicineInput;
