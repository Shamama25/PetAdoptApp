import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./../../config/FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo"; // Import Clerk's useUser hook
import { Picker } from "@react-native-picker/picker"; // Import Picker from the correct package

export default function AddNewPet() {
  const navigation = useNavigation();
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: "Fish",
    gender: "Male",
  });
  const [gender, setGender] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState(null); // Will store the image URI as a string
  const [loader, setLoader] = useState(false);

  const { user } = useUser(); // Access the current user with Clerk

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
    });
    GetCategories();
  }, [navigation]);

  const GetCategories = async () => {
    setCategoryList([]);
    const snapshot = await getDocs(collection(db, "Category"));
    const categories = [];
    snapshot.forEach((doc) => {
      categories.push(doc.data());
    });
    setCategoryList(categories);
  };

  const imagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Ensure this is a string
      console.log("Selected image URI:", result.assets[0].uri);
    } else {
      console.log("Image selection was canceled");
    }
  };

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onSubmit = () => {
    if (Object.keys(formData).length !== 8) {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.BOTTOM);
      return;
    }
    UploadImage();
  };

  const UploadImage = async () => {
    setLoader(true);
    try {
      if (!image) {
        console.log("No image selected");
        return;
      }

      const response = await fetch(image);
      const blobImage = await response.blob();

      const storageRef = ref(storage, "PetAdopt/" + Date.now() + ".jpg");

      const snapshot = await uploadBytes(storageRef, blobImage);
      console.log("File uploaded successfully:", snapshot);

      const downloadUrl = await getDownloadURL(storageRef);
      console.log("Download URL:", downloadUrl);
      SaveFormData(downloadUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setLoader(false);
  };

  const SaveFormData = async (imageUri) => {
    const docId = Date.now().toString();


    const userImage = user?.imageUrl || "";

    await setDoc(doc(db, "Pets", docId), {
      ...formData,
      imageUri: imageUri,
      username: user?.fullName || "Anonymous",
      email: user?.primaryEmailAddress?.emailAddress || "No Email",
      userImage: userImage,
      id: docId,
    });
    setLoader(false);
    router.replace("/(tabs)/home");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Pet for Adoption</Text>
      <Pressable onPress={imagePicker} style={{ marginVertical: 16 }}>
        {!image ? (
          <Image
            source={require("./../../assets/images/placeholder.png")}
            style={styles.imagePlaceholder}
          />
        ) : (
          <Image source={{ uri: image }} style={styles.image} />
        )}
      </Pressable>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Name*</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("name", value)}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Pet Category*</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => {
            setSelectedCategory(itemValue);
            handleInputChange("category", itemValue);
          }}
          style={styles.picker}
        >
          {categoryList.map((category, index) => (
            <Picker.Item
              key={index}
              label={category.name}
              value={category.name}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Breed*</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("breed", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age*</Text>
        <TextInput
          keyboardType="number-pad"
          style={styles.input}
          onChangeText={(value) => handleInputChange("age", value)}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Gender*</Text>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => {
            setGender(itemValue);
            handleInputChange("gender", itemValue);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight*</Text>
        <TextInput
          keyboardType="number-pad"
          style={styles.input}
          onChangeText={(value) => handleInputChange("weight", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address*</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("address", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>About*</Text>
        <TextInput
          style={styles.input}
          numberOfLines={5}
          multiline={true}
          onChangeText={(value) => handleInputChange("about", value)}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={onSubmit} disabled={loader}>
        {loader ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <Text style={styles.btnText}>Post</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontFamily: "outfitMedium",
    fontSize: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
  },
  inputContainer: {
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    fontFamily: "outfit",
    fontSize: 15,
    outline: "none",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "outfit",
  },
  pickerContainer: {
    marginVertical: 5,
  },
  picker: {
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    height: 50,
  },
  btn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical: 10,
  },
  btnText: {
    fontFamily: "outfitMedium",
    textAlign: "center",
    fontSize: 18,
    color: Colors.WHITE,
  },
});
