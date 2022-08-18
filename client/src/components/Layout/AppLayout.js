import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout, Typography, Col, Menu } from "antd";

import styles from "./layout.module.less";
import routes, { checkAccess } from "../../routes";
import { useRecoilState } from "recoil";
import { authState } from "../../atoms/auth";
import UserTop from "./userTop";

function Index(props) {
  const navigate = useNavigate();
  const [Auth, setAuth] = useRecoilState(authState);

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Layout className={styles.layout}>
      <Layout.Header>
        <Col className={styles.header}>
          <Col span={12}>
            <Typography.Title level={3}>
              <img
                src="/images/logo.jpg"
                alt="null"
                className={styles.image}
                onClick={() => {
                  handleClick();
                }}
              />
              Dr. M.A Ansari Health Centre
            </Typography.Title>
          </Col>
          <Col className={styles.theme}>
            <UserTop {...{ Auth, setAuth }} />
          </Col>
        </Col>
      </Layout.Header>
      <Layout>
        <Layout.Sider>
          <Menu theme="dark" mode="inline">
            <Menu.Item>
              <Link to="/">Home</Link>
            </Menu.Item>
            {routes.map((route, index) => {
              if (!checkAccess(Auth, route)) return null;
              return (
                <Menu.Item key={`${index} ${route.path}`}>
                  <Link to={route.path}>{route.text}</Link>
                </Menu.Item>
              );
            })}
          </Menu>
        </Layout.Sider>
        <Layout.Content className={styles.content}>
          {props.children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default Index;
