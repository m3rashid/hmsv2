import React from "react";
import { Spin, Image, Space, Typography } from "antd";

import styles from "./loading.module.less";

function Loading({ spin = true, text = "Loading..." }) {
  return (
    <div className={styles.loading}>
      <Space direction="vertical" align="center">
        {spin && <Spin />}
        <Typography.Text style={{ opacity: 0.8 }}>{text}</Typography.Text>
      </Space>
      <Image src="/images/logo.jpg" className={styles.image} />
    </div>
  );
}

export default Loading;
