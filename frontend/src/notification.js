import { getToken } from "firebase/messaging";
import { firebaseMessaging } from "./firebase.js";

const requestNotificationPermission = async () => {
  try {
    // Ask browser for notification permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    console.log("Notification permission granted");

    // Get Firebase Cloud Messaging token
    const token = await getToken(firebaseMessaging, {
      vapidKey: "BI_VbH_CduIWfvwDdIbFCkJuzhPALzIFnzS26lf40aeYZ1_NhvJ5YQ8gDQbzM5tdKv6n0WOiNtXxlaNcmUSZPIQ"
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    }

    console.log("No FCM token received");
    return null;

  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
};

export default requestNotificationPermission;