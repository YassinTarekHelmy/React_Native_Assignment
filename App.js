import React, { useEffect, useState } from "react";
import { Text, View, Button, FlatList, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { loadChannels, getChannelName, getSubscribedChannels, currentUserId, subscribeToChannel, unsubscribeFromChannel, LoadMessages, getChannelId, sendMessage, listenForNewMessages} from "./Database";
import { requestUserPermissionAndToken, setupNotificationHandlers } from "./Notifications";


export default function Channels() {
  const [channelNames, setChannelNames] = useState([]); 
  const [subscribedChannelsState, setSubscribedChannelsState] = useState([]); 
  const [isGroupChat, setIsGroupChat] = useState(false); 
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("");

  useEffect(() => {
    listenForNewMessages(channel, setMessages);
    fetchChannels();
    requestUserPermissionAndToken();

    const unsubscribe2 = setupNotificationHandlers();

    async function fetchChannels() {
      const channels = await loadChannels();
      const names = [];
      
      const subscribedChannels = await getSubscribedChannels(currentUserId);

      const subscribedChannelNames = [];
      
      for (var channel of channels) {
        const name = await getChannelName(channel);
        
        names.push(name);  
      }
      
      for (var channel of subscribedChannels) {
        console.log("Subscribed Channel: ", name);
        const name = await getChannelName(channel);
       
        subscribedChannelNames.push(name);  
      }
      
      
      setChannelNames(names);

      console.log("Channels: ", channelNames);

      setSubscribedChannelsState(subscribedChannelNames);

      console.log("Subscribed Channels: ", subscribedChannelsState);



    }
    
    return () => {
      if (unsubscribe2) {
        unsubscribe2();
      }
    };
  }, []);

  // Subscribe to a channel (Firebase Topic)
  const subscribeToChannelFront = async (channel) => {
    try {
      await messaging().subscribeToTopic(channel);
      setSubscribedChannelsState((prev) => [...prev, channel]);
      
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
      setSubscribedChannelsState((prev) => prev.filter((ch) => ch !== channel));
      
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
    sender: {
      fontSize: 12,
      color: "#666",
      marginTop: 5,
    }
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
              {subscribedChannelsState.includes(item) ? (
                <>
                  <Button
                    title="Group Chat"
                    onPress={async () => {
                      setChannel(item);
                      setMessages(await LoadMessages(item));
                      
                      setIsGroupChat(true)} 
                    }
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
      <Button title="Back" onPress={() => setIsGroupChat(false)} color="black" />
      <Text style={styles.title}>Group Chat</Text>
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageItem}>
              <Text style={styles.messageText}>{item.message}</Text>
              <Text style={styles.sender}> {item.sender} </Text>
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
        <Button title="Send" 
          onPress={ async () => 
            {
              await sendMessage(channel, message);
              await LoadMessages(channel);
              // await LoadMessages(channel);  
            }} color="blue" />
      </View>
    </KeyboardAvoidingView>
    );
  }
}
