import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { collection, doc, getDoc, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { GiftedChat } from 'react-native-gifted-chat';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const { user } = useUser();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    GetUserDetails();

    const unsubscribe = onSnapshot(
      collection(db, 'Chat', params?.id, 'Messages'),
      (snapshot) => {
        const messageData = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        }));

        // Sort messages by createdAt to ensure the correct order
        messageData.sort((a, b) => b.createdAt - a.createdAt);

        setMessages(messageData);
      }
    );

    return () => unsubscribe();
  }, []);

  const GetUserDetails = async () => {
    try {
      const docRef = doc(db, 'Chat', params?.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const result = docSnap.data();
        const otherUser = result?.users.filter(item => item.email !== user.primaryEmailAddress.emailAddress);
        if (otherUser.length > 0) {
          navigation.setOptions({
            headerTitle: otherUser[0].name || "Chat"
          });
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  }

  const onSend = async (newMessages = []) => {
    const message = newMessages[0];


    if (!user?.profileImageUrl) {
      delete message.user.avatar;
    }


    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

    await addDoc(collection(db, 'Chat', params.id, 'Messages'), {
      ...message,
      createdAt: new Date(),
    });
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      showUserAvatar={true}
      user={{
        _id: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
        avatar: user?.profileImageUrl,
      }}
    />
  );
}
