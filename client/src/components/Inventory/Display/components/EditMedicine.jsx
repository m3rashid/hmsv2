import React from "react";
import { message } from "antd";
import PropTypes from "prop-types";
import { useSetRecoilState } from "recoil";

import { instance } from "../../../../api/instance";
import { inventoryState } from "../../../../atoms/inventory";
import InventoryFormHandler from "../../../../components/Inventory/FormHandler";

function EditMedicine(props) {
  const setInventoryData = useSetRecoilState(inventoryState);

  const UpdateMedicine = async (data) => {
    const { data: MedicineData } = await instance.post("/inventory/edit/", {
      type: props.type,
      data: data.values,
      id: props.data.id,
    });

    setInventoryData((prevState) => {
      return {
        ...prevState,
        [props.type]: {
          ...prevState[props.type],

          inventory: [
            ...prevState[props.type].inventory.filter(
              (item) => item.id !== props.data.id
            ),
            MedicineData.medicine,
          ],
        },
      };
    });
    props.setIsModalVisible({
      open: false,
      data: props.data,
    });
    message.success("Medicine updated successfully");
  };

  return (
    <div>
      <InventoryFormHandler
        type={props.type}
        defaultValues={props.data}
        Col={{
          label: 12,
          wrapper: 12,
        }}
        formSubmit={UpdateMedicine}
      />
    </div>
  );
}

EditMedicine.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  setIsModalVisible: PropTypes.func.isRequired,
};

export default EditMedicine;
