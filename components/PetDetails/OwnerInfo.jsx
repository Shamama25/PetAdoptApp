import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function OwnerInfo({ pet }) {


  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Image
          source={{
            uri: pet?.userImage || "https://via.placeholder.com/50",
          }}
          style={styles.image}
          onError={(e) => console.log('Error loading image:', e.nativeEvent.error)} // Image loading error log
        />
        <View>
          <Text style={styles.username}>
            {pet?.username || "Unknown User"}
          </Text>
          <Text style={styles.label}>Pet Owner</Text>
        </View>
      </View>
      <Ionicons name="send-sharp" size={24} color={Colors.PRIMARY} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#ddd",
    backgroundColor: Colors.WHITE,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 99,
  },
  username: {
    fontFamily: "outfitMedium",
    fontSize: 17,
  },
  label: {
    fontFamily: "outfit",
    color: Colors.GRAY,
  },
});
