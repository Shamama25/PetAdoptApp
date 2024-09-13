import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import OwnerInfo from "../../components/PetDetails/OwnerInfo";
import Colors from "../../constants/Colors";
import { doc, getDoc, deleteDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { db } from "../../config/FirebaseConfig";

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const router = useRouter();
  const [updatedPet, setUpdatedPet] = useState(pet);

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
    fetchPetImage();
  }, []);

  const fetchPetImage = async () => {
    try {
      const petDocRef = doc(db, "Pets", pet.id);
      const petDoc = await getDoc(petDocRef);

      if (petDoc.exists()) {
        const petData = petDoc.data();
        const updatedPetData = {
          ...pet,
          imageUri: petData.imageUri,
          email: petData.email, // Ensure that the pet owner's email is stored
        };
        setUpdatedPet(updatedPetData);
      } else {
        console.log("No such document exists!");
      }
    } catch (error) {
      console.error("Error fetching pet image:", error);
    }
  };

  const InitiateChat = async () => {
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const petEmail = updatedPet?.email || "unknown_email";
      const petUserImage = updatedPet?.userImage || "default_image_uri";
      const petUsername = updatedPet?.username || "Unknown User";

      const docId1 = userEmail + "_" + petEmail;
      const docId2 = petEmail + "_" + userEmail;

      const q = query(
        collection(db, "Chat"),
        where("id", "in", [docId1, docId2])
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs?.length > 0) {
        querySnapshot.forEach((doc) => {
          router.push({
            pathname: "/chat",
            params: { id: doc.id },
          });
        });
      } else {
        await setDoc(doc(db, "Chat", docId1), {
          id: docId1,
          users: [
            {
              email: userEmail,
              imageUri: user?.imageUri || "default_image_uri",
              name: user?.fullName || "Unknown User",
            },
            {
              email: petEmail,
              imageUri: petUserImage,
              name: petUsername,
            },
          ],
        });

        router.push({
          pathname: "/chat",
          params: { id: docId1 },
        });
      }
    } catch (error) {
      console.error("Error initiating chat:", error);
    }
  };

  const onDelete = async () => {
    console.log("onDelete function called");
    Alert.alert(
      "Delete Pet",
      "Are you sure you want to delete this pet?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const petDocRef = doc(db, "Pets", updatedPet.id);
              await deleteDoc(petDocRef);

              Alert.alert("Pet Deleted", "The pet has been deleted successfully.");
              router.replace("/(tabs)/home");
            } catch (error) {
              Alert.alert("Error", "Failed to delete the pet. Please try again.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* Pet Info */}
        <PetInfo pet={updatedPet} onDelete={onDelete} userEmail={userEmail} />
        {/* Pet SubInfo */}
        <PetSubInfo pet={updatedPet} />
        {/* About */}
        <AboutPet pet={updatedPet} />
        {/* Owner Details */}
        <View style={{ padding: 10 }}>
          <OwnerInfo pet={updatedPet} />
        </View>
        <View style={{ height: 70 }}></View>
      </ScrollView>
      {/* Adopt me Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={InitiateChat} style={styles.adoptBtn}>
          <Text style={styles.adoptBtnText}>Adopt Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  adoptBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  adoptBtnText: {
    textAlign: "center",
    fontFamily: "outfitMedium",
    fontSize: 20,
    color: Colors.WHITE,
  },
});