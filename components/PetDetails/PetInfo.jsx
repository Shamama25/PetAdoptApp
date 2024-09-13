import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import MarkFav from "../MarkFav";
import { Ionicons } from "@expo/vector-icons";

export default function PetInfo({ pet, onDelete, userEmail }) {
  // Log the received parameters
  console.log("Received pet data:", pet);
  console.log("Received onDelete function:", onDelete);
  console.log("Received userEmail:", userEmail);

  return (
    <View style={styles.container}>
      <Image source={{ uri: pet.imageUri }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.petName}>{pet?.name}</Text>
          <Text style={styles.petAddress}>{pet?.address}</Text>
        </View>
        <View style={styles.iconContainer}>
          <MarkFav pet={pet} />
          {pet.email === userEmail && (
            <TouchableOpacity onPress={onDelete} style={styles.trashIcon}>
              <Ionicons name="trash" size={24} color={Colors.WHITE} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  infoContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  petName: {
    fontFamily: "outfitBold",
    fontSize: 27,
    color: Colors.BLACK,
  },
  petAddress: {
    marginTop: 4,
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  trashIcon: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: "red",
  }
});
