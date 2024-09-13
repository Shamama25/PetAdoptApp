import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";

export default function Inbox() {
  const { user } = useUser();
  const [userList, setUserList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (user) {
      GetUserList();
    }
  }, [user]);

  const GetUserList = async () => {
    try {
      setLoader(true);
      setUserList([]);
      const userEmail = user?.primaryEmailAddress?.emailAddress;

      const q = collection(db, "Chat");
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const users = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();

          if (docData.id.includes(userEmail)) {
            const userDataArray = docData.users;

            userDataArray.forEach((userData) => {
              if (userData.email !== userEmail) {
                users.push({
                  docId: doc.id,
                  ...userData,
                });
              }
            });
          }
        });

        setUserList(users);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        marginTop: 20,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Text
        style={{
          fontFamily: "outfitMedium",
          fontSize: 30,
          marginBottom: 20,
        }}
      >
        Inbox
      </Text>
      {loader ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={userList}
          style={{
            marginTop: 20,
          }}
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={{
                marginBottom: 10,
                padding: 20,
                backgroundColor: "#fff",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text>{item.email}</Text>
            </View>
          )}
          keyExtractor={(item) => item.docId}
        />
      )}
    </View>
  );
}