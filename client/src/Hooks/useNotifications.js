import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { notificationsState } from "../atoms/notifications";

const useNotifications = () => {
  const [notifications, setNotifications] = useRecoilState(notificationsState);
  const addNotification = useCallback (({
    type,
    title,
    message,
    action,
    seen = false,
    time = new Date(),
  }) => {
    setNotifications(prevValue=>[
      { type, title, message, action, seen, time },
      ...prevValue,
    ]);
  },[setNotifications])
  const markAllAsSeen = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, seen: true }))
    );
    localStorage.setItem(
      "notifications",
      JSON.stringify(
        notifications.map((notification) => ({ ...notification, seen: true }))
      )
    );
  }
  const clearNotifications = () => {
    setNotifications([]);
  };
  const unseenNotifications = () => {
    return notifications.reduce((acc, notification) => {
      if (!notification.seen) {
        acc++;
      }
      return acc;
    }, 0);
  };

  return {
    notifications,
    addNotification,
    markAllAsSeen,
    clearNotifications,
    unseenNotifications,
  };
};
export default useNotifications;
