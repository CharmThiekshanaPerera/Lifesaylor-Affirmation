import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming Ionicons is the icon library you're using
import { quotes } from "../../data/zen.js";

const { width, height } = Dimensions.get('window');

const Quotes = ({ navigation }) => {
  const [quote, setQuote] = useState(null);
  const rotationValue = new Animated.Value(0);

  useEffect(() => {
    // Fetching a random quote on component mount
    fetchRandomQuote();
  }, []);

  const fetchRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    setQuote(randomQuote);
  };

  const startRotationAnimation = () => {
    rotationValue.setValue(0);
    Animated.timing(rotationValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      fetchRandomQuote();
    });
  };

  const rotateInterpolate = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {quote && (
        <ImageBackground source={{ uri: quote.photo_url }} style={styles.backgroundImage} resizeMode="cover">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.overlay}>
            <Text style={styles.name}>{quote.name}</Text>
            <Text style={styles.description}>{quote.description}</Text>
          </View>
        </ImageBackground>
      )}
      <TouchableOpacity
        style={[styles.refreshButton, { transform: [{ rotate: rotateInterpolate }] }]}
        onPress={startRotationAnimation}
      >
        <Icon name="refresh" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 150,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    padding: 10,
    zIndex: 1, // Ensure the close button is above other components
  },
});

export default Quotes;
