import {
  Form,
  Button,
  AutoComplete,
  message,
  Typography,
  Col,
  Input,
  Select,
  DatePicker,
} from "antd";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import React, { useState } from "react";

import { instance } from "../../api/instance";
import { inventoryState } from "../../atoms/inventory";
import { Category, InventoryTypes, MedType } from "../../utils/inventoryTypes";
import StatefullFormRenderer from "../common/StatefullFormRenderer";

function InventoryFormHandler(props) {
  const [itemlist, setItemlist] = useState({
    data: [],
    cancelToken: undefined,
  });
  const inventory = useRecoilValue(inventoryState);
  const [Search, setSearch] = useState({
    name: [],
  });
  const [FormSelected, setFormSelected] = useState({
    item: null,
    type: props?.type,
  });
  const [form] = Form.useForm();

  const formSubmitHandler = async (values) => {
    console.log("formSubmitHandler", values);
    try {
      props.formSubmit({ values, FormSelected, form });
    } catch (err) {
      console.error(err);
      message.error("Error");
    }
  };

  const UpdateMedicine = async (value) => {
    if (itemlist.cancelToken) {
      itemlist.cancelToken.cancel();
    }

    try {
      const CancelToken = axios.CancelToken.source();

      setItemlist({
        data: [
          {
            value: "",
            label: "Loading..",
          },
        ],
        cancelToken: CancelToken,
      });

      const { data } = await instance.get("/inventory/search", {
        params: {
          name: value,
        },
      });

      setItemlist({
        ...itemlist,
        data: data.inventory.map((item) => {
          return {
            value: item.id,
            data: item,
            label: (
              <Col direction="vertical" size={"small"} style={{ fontSize: 12 }}>
                <Typography.Text>{item.name}</Typography.Text>
              </Col>
            ),
          };
        }),
        cancelToken: itemlist.cancelToken || CancelToken,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onSearchMedicineName = (value) => {
    console.log(inventory, FormSelected.type);
    const searchData = inventory[`${FormSelected.type}`].inventory
      .filter((item) => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      })
      .map((item) => ({
        value: item.name,
        data: item,
        label: item.name,
      }));

    setSearch({
      ...Search,
      name: searchData,
    });
  };

  console.log(props.defaultValues);

  return (
    <React.Fragment>
      <Form
        form={form}
        onFinish={formSubmitHandler}
        labelAlign="left"
        labelCol={{ span: props?.Col?.label || 4 }}
        wrapperCol={{ span: props?.Col?.wrapper || 8 }}
        initialValues={{
          ...props?.defaultValues,
          expiryDate: props?.defaultValues?.expiryDate
            ? moment(props?.defaultValues?.expiryDate, "YYYY-MM-DD")
            : undefined,
        }}
      >
        <Form.Item
          label="Inventory Type"
          name="type"
          style={{ display: props?.type ? "none" : "block" }}
        >
          <Select
            placeholder="Select Inventory Type"
            onChange={(value) => {
              setFormSelected({
                ...FormSelected,
                type: value,
              });
            }}
          >
            {Object.keys(InventoryTypes).map((item) => (
              <Select.Option key={item} value={item} />
            ))}
          </Select>
        </Form.Item>
        <StatefullFormRenderer render={FormSelected.type}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name of the medicine!",
              },
            ]}
          >
            <AutoComplete
              onSearch={onSearchMedicineName}
              allowClear
              options={Search.name}
            />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              {
                required: true,
                message: "Please input the name of the medicine!",
              },
            ]}
          >
            <Input placeholder="Enter Quantity" type={"number"} />
          </Form.Item>
        </StatefullFormRenderer>

        <StatefullFormRenderer
          render={[
            InventoryTypes.Medicine,
            InventoryTypes.NonMedicine,
          ].includes(FormSelected.type)}
        >
          <React.Fragment>
            <Form.Item
              label="Batch Number"
              name="batchNumber"
              rules={[
                {
                  required: true,
                  message: "Please input the batch number!",
                },
              ]}
            >
              <Input placeholder="Enter Batch Number" />
            </Form.Item>
            <Form.Item
              label="Expiry Date"
              name="expiryDate"
              rules={[
                {
                  required: true,
                  message: "Please input the expiry date!",
                },
              ]}
            >
              <DatePicker
                placeholder="Enter Expiry Date"
                type="date"
                disabledDate={(current) =>
                  current && current < moment().endOf("day")
                }
              />
            </Form.Item>
          </React.Fragment>
        </StatefullFormRenderer>

        <StatefullFormRenderer
          render={FormSelected.type === InventoryTypes.Medicine}
        >
          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
                message: "Please input the category!",
              },
            ]}
          >
            <Select
              placeholder="Select Category"
              options={Object.keys(Category).map((item) => ({
                label: item,
                value: item,
              }))}
            />
          </Form.Item>
          <Form.Item label="Manufacturer" name="manufacturer">
            <Input placeholder="Enter Manufacturer" />
          </Form.Item>
          <Form.Item
            label="Medicine Type"
            name="medType"
            rules={[
              {
                required: true,
                message: "Please input the medicine type!",
              },
            ]}
          >
            <Select
              placeholder="Select Medicine Type"
              options={Object.keys(MedType).map((item) => ({
                label: item,
                value: item,
              }))}
            />
          </Form.Item>
        </StatefullFormRenderer>

        <Form.Item wrapperCol={{ offset: 2 }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!FormSelected.type}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
}

InventoryFormHandler.propTypes = {
  defaultValues: PropTypes.object,
  type: PropTypes.string,
  Col: PropTypes.shape({
    label: PropTypes.number,
    wrapper: PropTypes.number,
  }),
  formSubmit: PropTypes.func.isRequired,
};

export default InventoryFormHandler;
