import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ChatMessage = ({ message, images }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>{message}</Text>
      <View style={styles.imageContainer}>
        {images?.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={styles.imageThumbnail}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    margin: 10,
    marginLeft: 15,
    marginRight: 15,
    borderColor: "#000",
    borderWidth: 0.5,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  imageThumbnail: {
    width: 50,
    height: 50,
    marginRight: 5,
  },
});

export default ChatMessage;
