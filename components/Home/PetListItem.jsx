import { View, Image, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import MarkFav from "../MarkFav";

export default function PetListItem({ pet }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/pet-details",
          params: pet,
        })
      }
    >
      <View
        style={{
          marginRight: 10,
          padding: 10,
          backgroundColor: Colors.WHITE,
          borderRadius: 10,
          width: 160, // Define a fixed width for consistency
        }}
      >
        <View
          style={{
            position: "absolute",
            zIndex: 10,
            right: 10,
            top: 10,
          }}
        >
          <MarkFav pet={pet} color={"gray"} />
        </View>
        <View
          style={{
            width: "100%", 
            height: 140, 
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: Colors.LIGHT_GRAY,
          }}
        >
          <Image
            source={{ uri: pet?.imageUri }}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="cover"
            onError={(e) =>
              console.log("Error loading image:", e.nativeEvent.error)
            }
          />
        </View>
        <Text
          style={{
            fontFamily: "outfitMedium",
            fontSize: 18,
            marginTop: 10,
          }}
        >
          {pet.name}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: Colors.GRAY,
              fontFamily: "outfit",
            }}
          >
            {pet?.breed}
          </Text>
          <Text
            style={{
              fontFamily: "outfit",
              color: Colors.PRIMARY,
              backgroundColor: Colors.LIGHT_PRIMARY,
              paddingHorizontal: 7,
              borderRadius: 99,
              fontSize: 13,
            }}
          >
            {pet.age} YRS
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
