import { Table, Input } from "antd";
import React, { useEffect, useState } from "react";

import { getEstimatedMedRequirement } from "./getEstimatedMedRequirement";

const MedicineTable = ({
  medicines = [],
  selectedMedicines,
  setSelectedMedicines,
}) => {
  const [dispensingMedicines, setDispensingMedicines] = useState([]);

  useEffect(() => {
    setDispensingMedicines(
      medicines.map((med) => {
        return {
          ...med,
          requiredQuantity: getEstimatedMedRequirement({
            dosage: med.dosage,
            duration: med.duration,
          }),
          amountDispensed: 0,
          stock: med.Medicine.quantity,
          name: med.Medicine.name,
          key: med.id,
        };
      })
    );
  }, [medicines]);

  const handlerDispensedAmount = (id, amount) => {
    setDispensingMedicines((prevState) => {
      return prevState.map((med, i) => {
        if (med.id === id) {
          return { ...med, amountDispensed: amount };
        }
        return med;
      });
    });
  };
  const columns = [
    {
      title: "Medicine",
      dataIndex: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "requiredQuantity",
    },
    {
      title: "Available Stock",
      dataIndex: "stock",
    },
    {
      title: "Amount Dispensed",
      dataIndex: "amountDispensed",
      render: (text, record) => {
        return (
          <Input
            onChange={(e) => handlerDispensedAmount(record.id, e.target.value)}
            type="number"
            min={0}
            max={Math.min(record.requiredQuantity, record.stock)}
            value={record.amountDispensed}
          />
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedMedicines(selectedRows);
      setDispensingMedicines((prevState) => {
        return prevState.map((med, i) => {
          if (selectedRowKeys.includes(med.key)) {
            return {
              ...med,
              amountDispensed: Math.min(med.requiredQuantity, med.stock),
            };
          } else {
            return {
              ...med,
              amountDispensed: 0,
            };
          }
        });
      });
    },
    getCheckboxProps: (record) => ({
      disabled: record.stock === 0, // Column configuration not to be checked
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    <Table
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      rowClassName={(record, index) => (record ? "available" : "unavailable")}
      columns={columns}
      dataSource={dispensingMedicines}
    />
  );
};

export default MedicineTable;
