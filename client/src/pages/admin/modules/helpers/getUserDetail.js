import { useRecoilState } from "recoil";
import { instance } from "../../../../api/instance";

import { formatForTable } from "./table";
import { adminState } from "../../../../atoms/admin";
import { Button, message } from "antd";

const useGetUserDetail = ({ userType, userRole }) => {
  const [adminData, setAdminData] = useRecoilState(adminState);

  const getAllUsers = async () => {
    if (adminData[userType].length !== 0) return;
    await getUsers();
  };

  const getUsers = async () => {
    try {
      const res = await instance.post("/admin/all", { userRole });

      const users = formatForTable(res.data.users);
      message.success("Users fetched successfully");
      setAdminData((prev) => ({ ...prev, [userType]: users }));
    } catch (err) {}
  };

  const RefreshUserButton = () => {
    return <Button onClick={getUsers}>Refresh Users</Button>;
  };

  return {
    getAllUsers,
    getUsers,
    RefreshUserButton,
    users: adminData[userType],
  };
};

export default useGetUserDetail;
