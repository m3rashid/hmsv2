import React from "react";
import Header from "../../components/Header";

const Patient = () => {
  const [online, setOnline] = React.useState(true);
  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <Header online={online} setOnline={setOnline} />
    </div>
  );
};

export default Patient;
