import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";


import TweetContent from "./TweetContent";

const TweetCell = ({ tweet }) => {
  const [showFullText, setShowFullText] = useState(false);
  return (
    <Pressable
      onPress={() => {
        // navigate("TweetDetailScreen", { tweet });
        setShowFullText(!showFullText);
      }}
    >
      <TweetContent tweet={tweet} showFullText={showFullText} />
    </Pressable>
  );
};

export default React.memo(TweetCell);
