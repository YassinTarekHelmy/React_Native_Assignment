import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";

// Request user permission and fetch the FCM token
export async function requestUserPermissionAndToken() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);

      // Get the FCM token
      const token = await messaging().getToken();

      console.log("FCM Token:", token);
      
      return token;
    } else {
      console.log("Permission not granted for notifications.");
      return null;
    }
  } catch (error) {
    console.error("Error requesting permission or fetching token:", error);
    throw error;
  }
}

// Set up background and foreground notification handlers
export function setupNotificationHandlers() {
  // Background message handler
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
  });

  // Foreground message listener
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
  });

  return unsubscribe; // Return the unsubscribe function for cleanup
}
