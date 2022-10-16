import React from "react";
import { useRecoilState } from "recoil";

import { instance } from "../../../../api/instance";
import { logReports } from "../../../../atoms/logs";

const initialState = {
  action: {},
  doneBy: {},
  actionToShow: {},
};

const useLogReports = () => {
  const [allLogs, setAllLogs] = useRecoilState(logReports);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [details, setDetails] = React.useState(initialState);

  const handleOk = () => {
    setIsModalVisible(true);
    setDetails(initialState);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setDetails(initialState);
  };

  const getLogs = async () => {
    const res = await instance.post("/admin/gen-report", {});
    setAllLogs(res.data);
  };

  const refreshLogs = () => {
    getLogs().then().catch();
  };

  const getDetails = async (logEntry) => {
    const res = await instance.post("/admin/report-details", { log: logEntry });
    const actionToShow = Object.entries(res.data.action).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {}
    );

    setDetails({
      action: res.data.action,
      doneBy: res.data.doneBy,
      actionToShow,
    });
    setIsModalVisible(true);
  };

  return {
    getLogs,
    allLogs,
    getDetails,
    handleOk,
    handleCancel,
    isModalVisible,

    details,
    refreshLogs,
  };
};

export default useLogReports;
