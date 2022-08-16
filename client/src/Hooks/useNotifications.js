import { useRecoilState } from "recoil"
import { notificationsState} from "../atoms/notifications"
const  useNotifications = () => {
    const [notifications, setNotifications] = useRecoilState(notificationsState);
    const addNotification = ({
        type,
        title,
        message,
        action,
        time = new Date(),
    }) => {

           localStorage.setItem("notifications", JSON.stringify({
            data: [{ type, title, message, action, time }, ...notifications.data],
            lastUpdated: Date.now(),
            unseen: notifications.unseen + 1,
        }));
        setNotifications({
            data: [{ type, title, message, action, time }, ...notifications.data],
            lastUpdated: Date.now(),
            unseen: notifications.unseen + 1,
        });
     


    }
    const markAllAsSeen = () => {
        localStorage.setItem("notifications", JSON.stringify({
            ...notifications, unseen: 0,
        }));
        setNotifications({...notifications, unseen: 0});
    }
    const clearNotifications = () => {
        setNotifications({
            data: [],
            lastUpdated: Date.now(),
            unseen: 0,
        });
        localStorage.removeItem("notifications");
    }

    return {
        notifications,
        addNotification,
        markAllAsSeen,
        clearNotifications,
    }
 
}
export default useNotifications;