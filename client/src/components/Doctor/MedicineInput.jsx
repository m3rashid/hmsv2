import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { Button, Col, Input, Row, Select, Space, Spin, Typography } from "antd";
import { useDebounce } from "use-debounce";
import styles from "./medicineinput.module.css";
import { inventoryState } from "../../atoms/inventory";
import { instance } from "../../api/instance";
import { dosages } from "../../utils/constants";
import { MdDelete } from "react-icons/md";
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
  const [availabilityInfo, setAvailabilityInfo] = useState({
    available: true,
    quantityRequired: 0,
    medicine: null,
    loading: false,
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
      setAvailabilityInfo((prev) => ({ ...prev, loading: true }));

      const data = {
        dosage: value.dosage,
        medicineId: value?.Medicine?.id,
        duration: parseInt(value.duration),
      };

      if (data.dosage === "" || data.duration === 0 || !data?.medicineId)
        return;

      const { data: availabilityInfoData } = await instance.post(
        "/doctor/med/check-availability",
        data
      );
      setAvailabilityInfo({
        ...availabilityInfoData,
        loading: false,
      });
    }
  }, [value]);

  useEffect(() => {
    ValidateMedicine();
  }, [ValidateMedicine]);

  useEffect(() => {
    UpdateMedicine(medicineType, { ...value, ...availabilityInfo }, index);
  }, [value, availabilityInfo, UpdateMedicine, medicineType, index]);

  console.log(MedicineData);

  return (
    <Row
      style={{
        borderBottom: "1px solid #ddd",
        margin: "10px 0",
      }}
    >
      <Col
        style={{
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 10px",
          margin: "auto",
        }}
        span={6}
      >
        <Select
          style={{ width: 220 }}
          // style={{flexGrow: 1 }}

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

        {!isExtra && medicine?.medicine?.quantity && (
          <Typography.Text type="danger">
            {medicine?.medicine?.quantity} left!
          </Typography.Text>
        )}
      </Col>
      <Col
        span={4}
        style={{
          borderRight: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          padding: "0 10px",
        }}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select Dosage"
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

        {medicine?.medicine?.medType === "SYRUP" && (
          <Space>
            {/* <Typography>Dosage Amount :</Typography> */}
            <Input
              placeholder="Dosage Amount"
              type="number"
              min={0}
              onChange={(e) => handleChange(e.target.value, "dosageAmount")}
              value={medicine.dosageAmount}
              addonAfter={"ml"}
            />
          </Space>
        )}
      </Col>
      <Col
        span={5}
        style={{
          borderRight: "1px solid #ddd",
          display: "flex",
          margin: "auto",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 10px",
        }}
      >
        {/* <Space style={{ width: "100%" }}> */}
        {/* <Typography>Duration : </Typography> */}
        <Input
          type={"number"}
          placeholder="Enter duration"
          defaultValue={medicine.duration}
          className={styles.input}
          onChange={(e) => handleChange(e.target.value, "duration")}
          addonAfter={"days"}
        />
        {/* </Space> */}
      </Col>
      {/* <Col
        span={3}
        style={{
          borderRight: "1px solid #ddd",
          // display: 'flex',
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          padding: "0 10px",
          display: isExtra ? "none" : "flex",
        }}
      >
        <Spin spinning={availabilityInfo.loading && medicine.medicine}>
          {availabilityInfo.medicine && (
            <Space>
              {availabilityInfo?.available ? (
                <>
                  <Typography.Text type="success">Available</Typography.Text>
                </>
              ) : (
                <Typography.Text type="warning">Unavailable</Typography.Text>
              )}
            </Space>
          )}
        </Spin>
      </Col> */}
      <Col
        span={5}
        style={{
          borderRight: "1px solid #ddd",
          padding: "0 10px",
        }}
      >
        <Input.TextArea
          className={styles.textarea}
          defaultValue={medicine.description}
          onChange={(e) => handleChange(e.target.value, "description")}
        />
      </Col>
      <Col
        span={4}
        style={{
          borderRight: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 10px",
          margin: "auto",
        }}
      >
        <Space
          direction="vertical"
          style={{ width: "100%", justifyContent: "center" }}
        >
          <Button
            type="dashed"
            danger
            onClick={() => deleteMedicine(index, medicineType)}
          >
            <MdDelete size={20} />
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

MedicineInput.propTypes = {
  index: PropTypes.number.isRequired,
  medicine: PropTypes.object.isRequired,
  deleteMedicine: PropTypes.func.isRequired,
  setMedicines: PropTypes.func.isRequired,
};

export default MedicineInput;
