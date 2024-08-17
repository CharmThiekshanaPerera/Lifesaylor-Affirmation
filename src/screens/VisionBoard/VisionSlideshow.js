//VisionSlideshow.js
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import Svg, { Text as SvgText } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';

const VisionSlideshow = ({ route, navigation }) => {
  const { visionBoardName, visionSectionName, description, images } = route.params;

  const handleClose = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <FontAwesome name="close" size={24} color="white" />
      </TouchableOpacity>
      <Swiper style={styles.wrapper} showsButtons={true}>
        {images.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            <Svg style={styles.textOverlay}>
              <SvgText x="50%" y="40%" textAnchor="middle" fontSize="24" fill="white">
                {visionBoardName}
              </SvgText>
              <SvgText x="50%" y="50%" textAnchor="middle" fontSize="24" fill="white">
                {visionSectionName}
              </SvgText>
              <SvgText x="50%" y="60%" textAnchor="middle" fontSize="24" fill="white">
                {description}
              </SvgText>
            </Svg>
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  textOverlay: {
    position: 'absolute',
    zIndex: 1,
  },
});

export default VisionSlideshow;
