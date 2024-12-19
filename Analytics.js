import { Alert } from 'react-native';

import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';

export async function logUserSubscription(channel, action) {
    await analytics().logEvent('channel_subscription', {
      channel_name: channel,
      action: action, // e.g., 'subscribed' or 'unsubscribed'
    });
  }
  
  // Log First-Time Login
  export async function logFirstTimeLogin(userId) {
    await analytics().logEvent('first_time_login', {
      user_id: userId,
    }).catch((error) => {
      console.error('Error logging first-time login:', error);
    }).then(() => {
      Alert.alert("Welcome to the app! We're glad you're here.");
    });

  }

  export async function listenForFirstTimeLogin() {
    await analytics().event('first_time_login').onLog((event) => {
      Alert.alert("Welcome to the app! We're glad you're here.");
    });
  }