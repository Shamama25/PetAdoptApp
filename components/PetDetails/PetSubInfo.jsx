import { View } from "react-native";
import React from "react";
import PetSubInfoCard from "./PetSubInfoCard";

export default function PetSubInfo({ pet }) {
  return (
    <View
      style={{
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          display: "flex",
        }}
      >
        <PetSubInfoCard
          icon={require("./../../assets/images/calendar.png")}
          title={"Age"}
          value={pet?.age + " Years"}
        />
        <PetSubInfoCard
          icon={require("./../../assets/images/bone.png")}
          title={"Breed"}
          value={pet?.breed}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          display: "flex",
        }}
      >
        <PetSubInfoCard
          icon={require("./../../assets/images/gender.png")}
          title={"Gender"}
          value={pet?.gender}
        />
        <PetSubInfoCard
          icon={require("./../../assets/images/weight.png")}
          title={"Weight"}
          value={pet?.weight + " Kg"}
        />
      </View>
    </View>
  );
}
