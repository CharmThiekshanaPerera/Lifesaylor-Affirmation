import React from "react";
import { View, Text, Image } from "react-native";

// Import the logo
import logo from "../../../assets/icon.png";

export default function DrawerContainer(props) {
  const { navigation } = props;

  return (
    <View style={styles.content}>
      <View style={styles.container}>
        {/* Logo */}
        <Image source={logo} style={styles.image} />

        {/* Title */}
        <Text style={styles.title}>Life Saylor Affirmation</Text>

        {/* Description */}
        <Text style={styles.description}>
          Embrace positivity and motivation in every aspect of your life with
          Life Saylor. Let affirmations guide you on your journey to
          self-discovery and well-being.
        </Text>
      </View>
    </View>
  );
}

// Styles
const styles = {
  content: {
    flex: 1,
    backgroundColor: "#ffffff", // Adjust the background color as needed
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333333", // Adjust the text color as needed
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666666", // Adjust the text color as needed
  },
};
