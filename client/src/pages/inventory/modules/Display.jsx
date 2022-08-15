import { Col, Input, Row, Space, Typography } from "antd";
import React from "react";
import styles from "../style.module.css";
import { List } from "antd";
import VirtualList from "rc-virtual-list";
import { useQuery } from "react-query";
import { instance } from "../../../api/instance";

function Display() {
  const [SearchQuery, setSearchQuery] = React.useState("");

  const { data, isLoading, isError } = useQuery(
    ["inventory", SearchQuery],
    async () =>
      await instance.get("/inventory/search", {
        params: {
          name: SearchQuery,
        },
      })
  );
  console.log(data, isLoading, isError);

  if (isError) return <div>Error</div>;

  return (
    <div>
      <Input.Search
        placeholder="Search in Inventory"
        allowClear
        style={{ width: "80%", padding: "10px" }}
        onSearch={(value) => {
          console.log(value);
          setSearchQuery(value);
        }}
      />
      {!isLoading && (
        <List>
          <VirtualList
            data={data.data?.inventory}
            height={370}
            itemHeight={47}
            itemKey="id"
          >
            {(item) => (
              <List.Item key={item.id}>
                <Row
                  style={{
                    width: "100%",
                  }}
                >
                  <Col
                    span={1}
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography.Text
                      style={{
                        alignSelf: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {item.id}
                    </Typography.Text>
                  </Col>
                  <Col span={18}>
                    <Space direction="vertical" size="small">
                      <Typography.Text className={styles.card__title}>
                        {item.name}
                      </Typography.Text>
                      <Typography.Text
                        style={{
                          opacity: 0.5,
                        }}
                      >
                        {item.description}
                      </Typography.Text>
                    </Space>
                  </Col>
                  <Col span={4}>
                    <Space>
                      <Typography.Text type="danger">
                        {item.quantity} Left!
                      </Typography.Text>
                      <div className={styles.card__price}>
                        <Typography
                          style={{
                            color: "white",
                            paddingRight: "3px",
                          }}
                        >
                          ₹
                        </Typography>
                        <Typography
                          style={{
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          {item.price}
                        </Typography>
                      </div>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
            )}
          </VirtualList>
        </List>
      )}
    </div>
  );
}

export default Display;
