import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const Menu = [
  {
    id: 1,
    name: "Add New Pet",
    icon: "add-circle-outline",
    path: "/add-new-pet",
  },
  {
    id: 5,
    name: "My Posts",
    icon: 'bookmark',
    path: '/../user-post'
  },
  {
    id: 2,
    name: "Favorites",
    icon: "heart-outline",
    path: "/(tabs)/favorite"
  },
  {
    id: 3,
    name: "Inbox",
    icon: "mail-outline",
    path: "/(tabs)/inbox"
  },
  {
    id: 4,
    name: "Logout",
    icon: "log-out-outline",
    path: "logout"
  },
];

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleMenuPress = (item) => {
    if (item.path === "logout") {
      signOut();
      return;
    } else {
      router.push(item.path);
    }
  };

  return (
    <ScrollView
      style={{
        padding: 20,
        marginTop: 20,
      }}
    >
      <View
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 80,
          marginBottom: 40,
        }}
      >
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 99,
          }}
        />

        <Text
          style={{
            fontFamily: "outfitBold",
            fontSize: 20,
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          {user?.fullName}
        </Text>
        <Text
          style={{ fontFamily: "outfit", fontSize: 16, color: Colors.GRAY }}
        >
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <FlatList
        data={Menu}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleMenuPress(item)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 6,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.WHITE,
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={Colors.PRIMARY}
              style={{
                padding: 10,
                backgroundColor: Colors.PRIMARY,
                borderRadius: 8,
                color: Colors.LIGHT_PRIMARY,
              }}
            />
            <Text
              style={{
                marginLeft: 10,
                fontFamily: "outfitMedium",
                fontSize: 17,
                color: "#000",
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}
