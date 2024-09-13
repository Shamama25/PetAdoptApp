import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";

export default function PetSubInfoCard({ pet }) {
  const [readMore, setReadMore] = useState(false);

  return (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          fontFamily: "outfitMedium",
          fontSize: 20,
        }}
      >
        About {pet?.name}
      </Text>
      <Text
        numberOfLines={readMore ? undefined : 2}
        style={{
          marginTop: 8,
          marginBottom: 4,
          fontFamily: "outfit",
          fontSize: 15,
          color: Colors.GRAY,
          lineHeight: 24,
        }}
      >
        {pet.about}
      </Text>
      <TouchableOpacity onPress={() => setReadMore(!readMore)}>
        <Text
          style={{
            fontFamily: "outfitMedium",
            fontSize: 16,
            color: Colors.SECONDARY,
          }}
        >
          {readMore ? "Read Less" : "Read More"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
