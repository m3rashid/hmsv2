import { Tabs, Typography } from "antd";
import React from "react";
import Header from "../../components/Header";
import AddNew from "./modules/AddNew";
import Display from "./modules/Display";
import styles from "./style.module.css";

const { TabPane } = Tabs;

function Inventory() {
  return (
    <div className={styles.container}>
      <Typography.Title level={4}>Inventory Management System</Typography.Title>
      <Header />

      <Tabs>
        <TabPane tab="Inventory Show" key="1">
          <Display />
        </TabPane>
        <TabPane tab="Inventory Add" key="2">
          <AddNew />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Inventory;
