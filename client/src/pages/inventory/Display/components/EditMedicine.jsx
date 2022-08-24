import React from "react";
import PropTypes from "prop-types";
import InventoryFormHandler from "../../../../components/Inventory/FormHandler";
import { instance } from "../../../../api/instance";
import { useRecoilState } from "recoil";
import { inventoryState } from "../../../../atoms/inventory";
import { message } from "antd";

function EditMedicine(props) {
  const [inventoryData, setInventoryData] = useRecoilState(inventoryState);

  const UpdateMedicine = async (data) => {
    console.log(data);
    const { data: MedicineData } = await instance.post("/inventory/edit/", {
      type: props.type,
      data: data.values,
      id: props.data.id,
    });

    setInventoryData((prevState) => {
      console.log(prevState[props.type]);
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
