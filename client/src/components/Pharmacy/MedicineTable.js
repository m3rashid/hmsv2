import React from 'react'
import { Divider, Radio, Table } from 'antd';
const DOSAGE_MAP = {
    'OD': 1,
    'BD': 2,
    'TD': 3,
    'QD': 4,
    'OW': 1/7,
    'BW': 2/7,
    'TW': 3/7,
    'QW': 4/7,
}
const MedicineTable = ({medicines=[], selectedMedicines, setSelectedMedicines}) => {

    const medicinesWithRequiredQuantity = medicines.map(med => {
        return {
            ...med,
            requiredQuantity: Math.ceil(med.duration * DOSAGE_MAP[med.dosage]),
            stock: med.Medicine.quantity,
            name: med.Medicine.name,
            key : med.Medicine.id,
        }
    })
    console.log(medicines);
    const columns = [
  {
    title: 'Medicine',
    dataIndex: 'name',
    render: (text) => <span>{text}</span>,
  },
  {
    title: 'Quantity',
    dataIndex: 'requiredQuantity',
  },
  {
    title: 'Available Stock',
    dataIndex: 'stock',
  },
];
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    setSelectedMedicines(selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.requiredQuantity > record.stock, // Column configuration not to be checked
    // Column configuration not to be checked
    name: record.name
  }),
};
  return (
     <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={medicinesWithRequiredQuantity}
      />
  )
}

export default MedicineTable