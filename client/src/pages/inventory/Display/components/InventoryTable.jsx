import {
  Alert,
  Button,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { instance } from "../../../../api/instance";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { authState } from "../../../../atoms/auth";
import { permissions } from "../../../../routes";
import { useNavigate } from "react-router-dom";
import { inventoryState } from "../../../../atoms/inventory";
import EditMedicine from "./EditMedicine";

function InventoryTable(prop) {
  const auth = useRecoilValue(authState);
  const inventory = useRecoilValue(inventoryState);
  console.log(inventory);
  const [SearchQuery, setSearchQuery] = React.useState({});
  const [isModalVisible, setIsModalVisible] = useState({
    open: false,
    isEdit: false,
    isDeleting: false,
    data: {},
  });
  const [data, setData] = useState(inventory[prop.type].inventory);

  useEffect(() => {
    setData(
      inventory[prop.type]?.inventory?.filter((item) =>
        item?.name?.toLowerCase().includes(SearchQuery[prop.type] || "")
      )
    );
  }, [inventory, SearchQuery, prop.type]);

  console.log(data);

  const hasEditPermission = useMemo(() => {
    if (auth.user.permissions.includes(permissions.INVENTORY_ADD_MEDICINE)) {
      return true;
    }
    return false;
  }, [auth.user.permissions]);

  console.log(hasEditPermission);

  const navigate = useNavigate();

  const modalData = [
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
  ];

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
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
      title: "Actions",
      key: "id",
      render: (text, record) => (
        <Space size={"middle"}>
          <Button
            type="dashed"
            onClick={() => {
              setIsModalVisible({
                open: true,
                data: record,
              });
            }}
          >
            View More
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row
        style={{
          width: "100%",
        }}
      >
        <Col span={18}>
          <Input.Search
            placeholder="Search in Inventory"
            allowClear
            style={{ width: "100%", padding: "10px" }}
            onSearch={(value) => {
              console.log(value);
              setSearchQuery({
                ...SearchQuery,
                [prop.type]: value,
              });
            }}
          />
        </Col>
        <Col
          span={6}
          style={{
            paddingLeft: "10px",
            display: "flex",
          }}
        >
          <Button
            type="primary"
            style={{
              display: hasEditPermission ? "block" : "none",
              alignSelf: "center",
            }}
            onClick={() => {
              navigate("/inventory/new");
            }}
          >
            + Add New
          </Button>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} />

      {isModalVisible.open && (
        <Modal
          title={isModalVisible.isEdit ? "Edit Medicine" : "View Medicine"}
          visible={isModalVisible.open}
          onOk={() => setIsModalVisible({ open: false, data: {} })}
          onCancel={() => setIsModalVisible({ open: false, data: {} })}
        >
          {!isModalVisible.isEdit ? (
            <Space direction="vertical">
              <div>
                <Space direction="vertical">
                  <Typography.Text>
                    {" "}
                    ID : {isModalVisible.data.id}
                  </Typography.Text>
                  <Typography.Title level={4}>
                    {isModalVisible?.data?.name}
                  </Typography.Title>
                  <Typography.Text>
                    {isModalVisible?.data?.description}
                  </Typography.Text>
                  <Typography.Text type="danger">
                    {isModalVisible?.data?.quantity} Left
                  </Typography.Text>
                  {modalData.map((item) => {
                    if (!isModalVisible?.data?.[item.key]) return null;
                    return (
                      <Typography.Text key={item.key}>
                        {item.title} : {isModalVisible?.data?.[item.key]}
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
                    setIsModalVisible({
                      ...isModalVisible,
                      isEdit: true,
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  danger
                  onClick={() =>
                    setIsModalVisible({
                      ...isModalVisible,
                      isDeleting: true,
                    })
                  }
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
                onClose={() => {
                  setIsModalVisible({
                    ...isModalVisible,
                    isDeleting: false,
                  });
                }}
                action={
                  <Space
                    direction="horizontal"
                    style={{
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <Button danger>Accept</Button>
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
            <EditMedicine type={prop.type} data={isModalVisible.data} />
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