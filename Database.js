import database from '@react-native-firebase/database';

export let currentUserId = 1;

export async function loadChannels() {
    return await database().ref('Channels').once('value').then(snapshot => {
        let channels = [];
        snapshot.forEach(child => {
            channels.push(child.key);
        });
        return channels;
    }
    );
}

export async function subscribeToChannel(channel) {
    // Retrieve the channel ID from the channel name
    return await database().ref(`Channels/${channel}/Subscribers`).set({ currentUserId : currentUserId });

  }
  

  export async function unsubscribeFromChannel(channel) {
        return await database().ref(`Channels/${channel}/Subscribers`).once('value').then(snapshot => {

            snapshot.forEach(child => {
                if (child.val() == currentUserId) {
                    database().ref(`Channels/${channel}/Subscribers/${child.key}`).remove();
                }
            });
        });
  }
  

export async function getChannelName(channel) {
    return await database().ref(`Channels/${channel}/name`).once('value').then(snapshot => {
        return snapshot.val();
    });
}

export async function getSubscribedChannels(userId) {
    const snapshot = await database().ref('Channels').once('value');
    let channels = [];

    snapshot.forEach(async child => {
        const subscribers = await child.child('Subscribers');

        subscribers.forEach(async subscriber => {

            if (subscriber.val() == userId) {

                channels.push(child.key); 
            }
        });
    });

    return channels;
}

export async function getChannelId(channelName) {
    return await database().ref('Channels').once('value').then(snapshot => {
        let channelId = null;
        snapshot.forEach(child => {

            if (child.child('name').val() === channelName) {
                
                channelId = child.key;
            }
        });
        return channelId;
    });
}

export async function sendMessage(channel ,message) {
    const channelId = await getChannelId(channel);
    return await database().ref(`Channels/${channelId}/GroupChat`).push({ message: message, sender: currentUserId });
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