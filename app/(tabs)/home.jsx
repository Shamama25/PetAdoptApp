import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListByCategory from "../../components/Home/PetListByCategory";
import Colors from "../../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />
      {/* Slider */}
      <Slider />
      {/* Pet List + Category */}
      <PetListByCategory />
      {/* Add New Pet Option */}
      <Link href={"/add-new-pet"} style={styles.addNewPostContainer}>
        <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
        <Text style={styles.addNewPostText}>Add New Post</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  addNewPostContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 20,
    marginTop: 20,
    textAlign: "center",
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 99,
    borderStyle: "dashed",
    justifyContent: "center",
  },
  addNewPostText: {
    fontFamily: "outfitMedium",
    color: Colors.PRIMARY,
    fontSize: 18,
  },
});
