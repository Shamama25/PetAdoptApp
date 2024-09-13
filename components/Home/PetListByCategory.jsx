import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Category from "./Category";
import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import PetListItem from "./PetListItem";

export default function PetListByCategory() {
  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    GetPetList("Fish");
  }, []);

  /**
   * Used to get Pet List on Category Selection
   * @param {*} category
   * * */
  const GetPetList = async (category) => {
    setLoader(true);
    setPetList([]);
    const q = query(collection(db, "Pets"), where("category", "==", category));
    const querySnapshot = await getDocs(q);

    const pets = [];
    querySnapshot.forEach((doc) => {
      pets.push(doc.data());
    });
    setPetList(pets);
    setLoader(false);
  };

  return (
    <View style={styles.container}>
      <Category category={(value) => GetPetList(value)} />
      <FlatList
        data={petList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        refreshing={loader}
        onRefresh={() => GetPetList("Fish")}
        style={styles.flatList}
        renderItem={({ item, index }) => <PetListItem key={index} pet={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  flatList: {
    marginTop: 10,
  },
});
