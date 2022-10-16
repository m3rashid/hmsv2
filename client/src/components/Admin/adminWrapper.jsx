import React from "react";
import { useLocation } from "react-router-dom";

import { toSentenceCase } from "../../utils/strings";

const AdminWrapper = ({ aside, children }) => {
  const { pathname } = useLocation();

  const heading = pathname
    .split("/")[2]
    .split("-")
    .map(toSentenceCase)
    .join(" ");

  return (
    <>
      <div style={{ padding: "20px", paddingTop: "5px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2>{heading}</h2>
          {aside}
        </div>
        <div style={{ marginTop: "10px", marginLeft: "0px" }}>{children}</div>
      </div>
    </>
  );
};

export default AdminWrapper;
