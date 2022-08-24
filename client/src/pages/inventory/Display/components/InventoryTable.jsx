import {
  Alert,
  Button,
  Col,
  Input,
  message,
  Modal,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import React, { useEffect, useMemo, useState } from "react";

import EditMedicine from "./EditMedicine";
import { permissions } from "../../../../routes";
import { authState } from "../../../../atoms/auth";
import { instance } from "../../../../api/instance";
import { inventoryState } from "../../../../atoms/inventory";
import dayjs from "dayjs";

function InventoryTable(prop) {
  const auth = useRecoilValue(authState);
  const [inventory, setinventoryData] = useRecoilState(inventoryState);
  console.log(inventory);
  const [SearchQuery, setSearchQuery] = React.useState({});
  const [isModalVisible, setIsModalVisible] = useState({
    open: false,
    isEdit: false,
    isDeleting: false,
    isDeleteLoading: false,
    data: {},
  });
  const [data, setData] = useState(inventory[prop.type].inventory);

  useEffect(() => {
    setData(
      inventory[prop.type]?.inventory?.filter((item) =>
        item?.name
          ?.toLowerCase()
          .includes(SearchQuery[prop.type]?.toLowerCase() || "")
      )
    );
  }, [inventory, SearchQuery, prop.type]);

  const hasEditPermission = useMemo(() => {
    if (auth.user.permissions.includes(permissions.INVENTORY_ADD_MEDICINE)) {
      return true;
    }
    return false;
  }, [auth.user.permissions]);

  const navigate = useNavigate();

  const modalData = useMemo(
    () => [
      {
        title: "Quantity",
        key: "quantity",
        renderer: (item) => (
          <Typography.Text type="danger">{item} Left</Typography.Text>
        ),
      },
      {
        title: "Added On",
        key: "createdAt",
        renderer: (item) => (
          <Typography.Text>{dayjs(item).format("DD-MM-YYYY")}</Typography.Text>
        ),
      },
      {
        title: "Expiry Date",
        key: "expiryDate",
        renderer: (item) => (
          <Typography.Text>{dayjs(item).format("DD-MM-YYYY")}</Typography.Text>
        ),
      },
      {
        title: "Batch Number",
        key: "batchNumber",
      },
      {
        title: "Category",
        key: "category",
      },
      {
        title: "Med Type",
        key: "medType",
      },
      {
        title: "Menufacturer",
        key: "manufacturer",
      },
    ],
    []
  );

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (text, record) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Actions",
      key: "id",
      render: (text, record) => (
        <Space size={"middle"}>
          <Button
            type="dashed"
            onClick={() => setIsModalVisible({ open: true, data: record })}
          >
            View More
          </Button>
        </Space>
      ),
    },
  ];

  const DeleteInventoryItem = async () => {
    try {
      setIsModalVisible({ ...isModalVisible, isDeleteLoading: true });
      const id = isModalVisible.data.id;
      await instance.post(`/inventory/delete`, {
        type: prop.type,
        medicineId: id,
      });

      setData(data.filter((item) => item.id !== id));

      setinventoryData((prevState) => ({
        ...prevState,
        [prop.type]: {
          ...prevState[prop.type],
          inventory: prevState[prop.type].inventory.filter(
            (item) => item.id !== id
          ),
        },
      }));
      message.success("Item deleted successfully");
      setIsModalVisible({
        ...isModalVisible,
        open: false,
        isDeleteLoading: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Row style={{ width: "100%" }}>
        <Col span={18}>
          <Input.Search
            placeholder="Search in Inventory"
            allowClear
            style={{ width: "100%", padding: "10px" }}
            onSearch={(value) => {
              console.log(value);
              setSearchQuery({ ...SearchQuery, [prop.type]: value });
            }}
          />
        </Col>
        <Col span={6} style={{ paddingLeft: "10px", display: "flex" }}>
          <Button
            type="primary"
            style={{
              display: hasEditPermission ? "block" : "none",
              alignSelf: "center",
            }}
            onClick={() => navigate("/inventory/new")}
          >
            + Add New
          </Button>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} />

      {isModalVisible.open && (
        <Modal
          title={isModalVisible.isEdit ? "Edit Medicine" : "Medicine Details"}
          visible={isModalVisible.open}
          onOk={() => setIsModalVisible({ open: false, data: {} })}
          onCancel={() => setIsModalVisible({ open: false, data: {} })}
        >
          {!isModalVisible.isEdit ? (
            <Space direction="vertical">
              <div>
                {console.log(isModalVisible.data)}
                <Space direction="vertical">
                  <Typography.Title level={4}>
                    {isModalVisible?.data?.name}
                  </Typography.Title>
                  <Typography.Text>
                    {isModalVisible?.data?.description}
                  </Typography.Text>

                  {modalData.map((item) => {
                    if (!isModalVisible?.data?.[item.key]) return null;
                    return (
                      <Typography.Text key={item.key}>
                        <strong>{item.title} : </strong>
                        {item.renderer
                          ? item?.renderer(isModalVisible?.data?.[item.key])
                          : isModalVisible?.data?.[item.key]}
                      </Typography.Text>
                    );
                  })}
                </Space>
              </div>
              <Space
                style={{
                  display: hasEditPermission ? "flex" : "none",
                  marginTop: 25,
                }}
              >
                <Button
                  type="ghost"
                  onClick={() => {
                    setIsModalVisible({ ...isModalVisible, isEdit: true });
                  }}
                >
                  Edit
                </Button>
                <Button
                  danger
                  onClick={() => {
                    setIsModalVisible({ ...isModalVisible, isDeleting: true });
                  }}
                >
                  Delete
                </Button>
              </Space>
              <Alert
                style={{
                  display: isModalVisible.isDeleting ? "block" : "none",
                }}
                message="Are you sure you want to delete this medicine?"
                description="Deleting this medicine will remove the entire item from the inventory"
                type="error"
                showIcon
                action={
                  <Space
                    direction="horizontal"
                    style={{ marginTop: 20, marginBottom: 20 }}
                  >
                    <Button
                      danger
                      onClick={DeleteInventoryItem}
                      loading={isModalVisible.isDeleteLoading}
                    >
                      Accept
                    </Button>
                    <Button
                      type="dashed"
                      onClick={() => {
                        setIsModalVisible({
                          ...isModalVisible,
                          isDeleting: false,
                        });
                      }}
                    >
                      Decline
                    </Button>
                  </Space>
                }
              />
            </Space>
          ) : (
            <EditMedicine
              type={prop.type}
              data={isModalVisible.data}
              setIsModalVisible={setIsModalVisible}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

InventoryTable.propTypes = {
  type: PropTypes.string.isRequired,
};

export default InventoryTable;
