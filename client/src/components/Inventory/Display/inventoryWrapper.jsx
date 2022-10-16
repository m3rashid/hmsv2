import React from "react";
import { useLocation } from "react-router-dom";

import { toSentenceCase } from "../../../utils/strings";

const InventoryWrapper = ({ children }) => {
  const { pathname } = useLocation();

  const heading = pathname
    .split("/")[2]
    .split("-")
    .map(toSentenceCase)
    .join(" ");

  return (
    <>
      <div style={{ padding: "20px" }}>
        <div style={{ marginTop: "10px", marginLeft: "0px" }}>
          <h2>{heading}</h2>
          {children}
        </div>
      </div>
    </>
  );
};

export default InventoryWrapper;
