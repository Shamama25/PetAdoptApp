import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Shared from "./../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";

export default function MarkFav({ pet }) {
  const { user } = useUser();
  const [favList, setFavList] = useState([]);

  useEffect(() => {
    if (user) {
      GetFav();
    }
  }, [user]);

  const GetFav = async () => {
    try {
      const result = await Shared.GetFavList(user);
      console.log(result);
      setFavList(result.favorites || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const AddToFav = async () => {
    const favResult = favList;
    favResult.push(pet?.id);
    await Shared.UpdateFav(user, favResult);
    GetFav();
  };

  const removeFromFav = async () => {
    const favResult = favList.filter((item) => item != pet.id);
    await Shared.UpdateFav(user, favResult);
    GetFav();
  };

  return (
    <View style={styles.container}>
      {favList?.includes(pet.id) ? (
        <TouchableOpacity onPress={removeFromFav} style={styles.button}>
          <Ionicons name="heart" size={24} color="red" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => AddToFav()} style={styles.button}>
          <Ionicons name="heart-outline" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  button: {
    padding: 4,
  },
});
