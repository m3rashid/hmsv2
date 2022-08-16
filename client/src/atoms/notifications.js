import { atom } from "recoil";



const getNotificationHistory = () => {
    if(localStorage.getItem("notifications")) {
        let localNotifications =  JSON.parse(localStorage.getItem("notifications"));
        localNotifications = {
            ...localNotifications,
            data: localNotifications.data.slice(0, 100),
        }
        return localNotifications;
    }
    return {
        data: [],
        lastUpdated: null,
        unseen: 0,
    }
}


export const notificationsState = atom({
    key: "notifications",
    default: getNotificationHistory(),
});
