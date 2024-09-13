import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Shared from "./../../Shared/Shared";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import PetListItem from "../../components/Home/PetListItem";
import { useUser } from "@clerk/clerk-expo";

export default function Favorite() {
  const { user } = useUser();
  const [favIds, setFavIds] = useState([]);
  const [favPetList, setFavPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (user) {
      GetFavPetIds();
    }
  }, [user]);

  // Fetch Favorite Ids
  const GetFavPetIds = async () => {
    try {
      setLoader(true);
      const result = await Shared.GetFavList(user);
      if (result?.favorites?.length > 0) {
        setFavIds(result.favorites);
      } else {
        setFavPetList([]); // Clear the list if no favorites are found
      }
    } catch (error) {
      console.error("Error fetching favorite IDs:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (favIds.length > 0) {
      GetFavPetList(favIds);
    }
  }, [favIds]);

  const GetFavPetList = async (favIds) => {
    try {
      setLoader(true);
      setFavPetList([]);
      const q = query(collection(db, "Pets"), where("id", "in", favIds));
      const querySnapshot = await getDocs(q);

      const pets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavPetList(pets);
    } catch (error) {
      console.error("Error fetching favorite pets:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      {loader ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : favPetList.length > 0 ? (
        <FlatList
          data={favPetList}
          numColumns={2}
          onRefresh={GetFavPetIds}
          refreshing={loader}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <PetListItem pet={item} />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <Text style={styles.noFavoritesText}>
          You have no favorite pets yet.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  title: {
    fontFamily: "outfitMedium",
    paddingHorizontal: 16,
    fontSize: 30,
    marginBottom: 10,
    color: "#333",
  },
  itemContainer: {
    flex: 1,
    margin: 8,
  },
  separator: {
    backgroundColor: "transparent",
  },
  noFavoritesText: {
    fontFamily: "outfitMedium",
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
