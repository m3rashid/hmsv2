import React from "react";
import dayjs from "dayjs";

import useNotifications from "../../Hooks/useNotifications";

const Notifications = () => {
  const { notifications } = useNotifications();

  return (
    <div
      style={{
        gridGap: "15px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      }}
    >
      {notifications.map((item, index) => {
        return (
          <div
            key={index}
            style={{
              backgroundColor: "#077842",
              borderRadius: "5px",
              padding: "20px",
              color: "white",
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.message}</p>
            <p>{dayjs(item.tile).format("HH:mm:ss a, DD-MM")}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;
