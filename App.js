import React, { useEffect, useState } from "react";
import { Text, View, Button, FlatList, Alert, StyleSheet } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { loadChannels, getChannelName, getSubscribedChannels, currentUserId, subscribeToChannel, unsubscribeFromChannel} from "./Database";
import { get } from "@react-native-firebase/database";

export default function Channels() {
  const [channelNames, setChannelNames] = useState([]); // State for channel names
  const [subscribedChannels, setSubscribedChannels] = useState([]); // State for subscribed channels

  useEffect(() => {
    // Fetch available channels
    async function fetchChannels() {
      try {
        const channels = await loadChannels();
        const names = [];

        const subscribedChannels = await getSubscribedChannels(currentUserId);
        const subscribedChannelNames = [];

        subscribedChannels.forEach(async channel => {
          subscribedChannelNames.push(await getChannelName(channel));  
        });

        for (const element of channels) {
          const channelName = await getChannelName(element);
          names.push(channelName);
        }
        
        setChannelNames(names);
        setSubscribedChannels(subscribedChannelNames);

      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    }

    fetchChannels();
  }, []);

  // Subscribe to a channel (Firebase Topic)
  const subscribeToChannelFront = async (channel) => {
    try {
      await messaging().subscribeToTopic(channel);
      setSubscribedChannels((prev) => [...prev, channel]);
      
      await subscribeToChannel(channel);

      Alert.alert("Subscribed", `You are now subscribed to ${channel}`);
    } catch (error) {
      console.error("Subscription error:", error);
      Alert.alert("Error", `Failed to subscribe to ${channel}`);
    }
  };

  // Unsubscribe from a channel
  const unsubscribeFromChannelFront = async (channel) => {
    try {
      await messaging().unsubscribeFromTopic(channel);
      setSubscribedChannels((prev) => prev.filter((ch) => ch !== channel));
      
      await unsubscribeFromChannel(channel);

      Alert.alert("Unsubscribed", `You are now unsubscribed from ${channel}`);
    } catch (error) {
      console.error("Unsubscription error:", error);
      Alert.alert("Error", `Failed to unsubscribe from ${channel}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Channels</Text>
      <FlatList
        data={channelNames} // Use state for data
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.channelItem}>
            <Text style={styles.channelName}>{item}</Text>
            {subscribedChannels.includes(item) ? (
              <Button
                title="Unsubscribe"
                onPress={() => unsubscribeFromChannelFront(item)}
                color="red"
              />
            ) : (
              <Button
                title="Subscribe"
                onPress={() => subscribeToChannelFront(item)}
                color="green"
              />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  channelItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  channelName: { fontSize: 18 },
});
