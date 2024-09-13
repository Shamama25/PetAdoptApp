import { View, Text, Image } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";

export default function Header() {
  const { user } = useUser();
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 25,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      }}
    >
      <Image
        source={{ uri: user?.imageUrl }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 99,
        }}
      />
      <View>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 16,
            color: "gray",
          }}
        >
          Welcome
        </Text>
        <Text
          style={{
            fontFamily: "outfitMedium",
            fontSize: 20,
            color: "black",
          }}
        >
          {user?.fullName}
        </Text>
      </View>
    </View>
  );
}
