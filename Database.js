import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

export let currentUserId = 1;


export async function loadChannels() {
    
        // Fetch the 'Channels' document
        const doc = (await firestore().collection('messagingCollection1').doc('Channels').get());
        
        let channels =  doc.data();

        channels = Object.keys(channels);

        return channels;
        
}


export async function subscribeToChannel(channel) {
    // Retrieve the channel ID from the channel name
    const user = "user" + currentUserId;
    
    return await firestore().collection('messagingCollection1').doc('Channels').set({
         [channel] : {
            Subscribers: {
                [user]: currentUserId
            }
         } }, { merge: true });

  }
  

  export async function unsubscribeFromChannel(channel) {
    // Retrieve the channel ID from the channel name
    const user = "user" + currentUserId;
    
    const snapshot = await firestore()
    .collection('messagingCollection1')
    .doc('Channels')
    .update({
      [`${channel}.Subscribers.${user}`]: firestore.FieldValue.delete()
    });

    return snapshot;
  }
  

export async function getChannelName(channel) {
    const snapshot = await firestore().collection('messagingCollection1').doc('Channels').get();
    
    return snapshot.data()[channel].name;
}

export async function getSubscribedChannels(userId) {
    const snapshot = await firestore().collection('messagingCollection1').doc('Channels').get();

    let channels = [];
    
    const data = snapshot.data();

    for (const channel in data) {
        if (data[channel].Subscribers["user" + userId] == userId) {
            channels.push(channel);
        }
    }

    return channels;
}

export async function listenForNewMessages(channel, setMessages) {
    const channelId = await getChannelId(channel); 
    const messagesRef = database().ref(`Channels/${channelId}/GroupChat`);

    const handleNewMessage = (snapshot) => {
        const newMessage = snapshot.val(); 
        console.log("New message received: ", newMessage);

        setMessages(prevMessages => [...prevMessages, newMessage]); 
    };

    messagesRef.on('child_added', handleNewMessage);

}


export async function getChannelId(channelName) {
    const snapshot = await firestore().collection('messagingCollection1').doc('Channels').get();

    const data = snapshot.data();

    for (const channel in data) {
        if (data[channel].name == channelName) {
            return channel;
        }
    }
}

export async function sendMessage(channel ,message) {
    const channelId = await getChannelId(channel);
    const guid = generateGUID();
    return await database().ref(`Channels/${channelId}/GroupChat`).push({ id:guid , message: message, sender: currentUserId });
}

export async function LoadMessages(channel) {
    console.log(channel);
    let channelId = await getChannelId(channel);
    console.log(channelId);
    
    return await database().ref(`Channels/${channelId}/GroupChat`).once('value').then(snapshot => {
        let messages = [];
        snapshot.forEach(child => {
            console.log(child.val());
            messages.push(child.val());
        });
        return messages;
    });
}


function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = (c === 'x' ? r : (r & 0x3 | 0x8));
        return v.toString(16);
    });
}

console.log(generateGUID());
