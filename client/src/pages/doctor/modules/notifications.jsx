import React, {useEffect} from "react";
import useNotifications from "../../../Hooks/useNotifications";
import dayjs from "dayjs";

const GenerateData = (count) => {
  const data = [];

  for (let i = 0; i < count; i++) {
    data.push({
      patient: faker.name.findName(),
      disease: faker.lorem.sentence(),
      time: faker.date.past().toDateString(),
    });
  }
  return data;
};

const Notifications = () => {
  const { notifications} = useNotifications();

  return (
    <div
      style={{
        gridGap: "15px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      }}
    >
      {notifications.data.map((item, index) => {
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

            {/* <div>
              <b>Patient : &nbsp; </b> {item.patient}
            </div>
            <div>
              <b>Time : &nbsp; </b> {item.time}
            </div>
            <div>
              <b>Disease : &nbsp; </b>
              {item.disease}
            </div> */}
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;
