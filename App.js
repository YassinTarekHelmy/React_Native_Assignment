import React, { useEffect, useState } from "react";
import { Text, View, Button, FlatList, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { loadChannels, getChannelName, getSubscribedChannels, currentUserId, subscribeToChannel, unsubscribeFromChannel, getChannelId, sendMessage} from "./Database";
import { requestUserPermissionAndToken, setupNotificationHandlers } from "./Notifications";

export default function Channels() {
  const [channelNames, setChannelNames] = useState([]); // State for channel names
  const [subscribedChannels, setSubscribedChannels] = useState([]); // State for subscribed channels
  const [isGroupChat, setIsGroupChat] = useState(false); // State to manage group chat view
  const [messages, setMessages] = useState([]); // State to store messages
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchChannels();
    requestUserPermissionAndToken();

    const unsubscribe = setupNotificationHandlers();

    async function fetchChannels() {
      const channels = await loadChannels();
      const names = [];
      
      const subscribedChannels = await getSubscribedChannels(currentUserId);
      const subscribedChannelNames = [];
      
      console.log("Subscribed channels:", subscribedChannels);
      
      subscribedChannels.forEach(async channel => {
        subscribedChannelNames.push(await getChannelName(channel));  
      });
      
      for (const element of channels) {
        const channelName = await getChannelName(element);
        
        names.push(channelName);
      }
      
      setChannelNames(names);
      setSubscribedChannels(subscribedChannelNames);
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Subscribe to a channel (Firebase Topic)
  const subscribeToChannelFront = async (channel) => {
    try {
      await messaging().subscribeToTopic(channel);
      setSubscribedChannels((prev) => [...prev, channel]);
      
      let channelId = await getChannelId(channel);
      
      await subscribeToChannel(channelId);

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
      
      let channelId = await getChannelId(channel);
      await unsubscribeFromChannel(channelId);

      Alert.alert("Unsubscribed", `You are now unsubscribed from ${channel}`);
    } catch (error) {
      console.error("Unsubscription error:", error);
      Alert.alert("Error", `Failed to unsubscribe from ${channel}`);
    }
  };

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
    container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    chatContainer: { flex: 1 },
    messageItem: {
      padding: 10,
      marginBottom: 10,
      backgroundColor: "#fff",
      borderRadius: 5,
      elevation: 2,
    },
    messageText: { fontSize: 16 },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: "#ccc",
      padding: 10,
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: "blue",
      padding: 10,
      borderRadius: 5,
    },
    sendButtonText: {
      color: "#fff",
      fontSize: 16,
    },
  });

  if (!isGroupChat) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Available Channels</Text>
        <FlatList
          data={channelNames} 
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.channelItem}>
              <Text style={styles.channelName}>{item}</Text>
              {subscribedChannels.includes(item) ? (
                <>
                  <Button
                    title="Group Chat"
                    onPress={() => setIsGroupChat(true)} 
                    color="blue"
                  />
                  <Button
                    title="Unsubscribe"
                    onPress={() => unsubscribeFromChannelFront(item)}
                    color="red"
                  />
                </>
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
  } else {
    return (
      <KeyboardAvoidingView
      style={styles.container}
    >
      <Text style={styles.title}>Group Chat</Text>
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageItem}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={sendMessage} color="blue" />
      </View>
    </KeyboardAvoidingView>
    );
  }
}
