import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Modal } from 'react-native';
import Swiper from 'react-native-swiper';
import Svg, { Text as SvgText } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';

const JournalEntryPreviewModal = ({ isVisible, onClose, journalData }) => {
  const { date, image, entry } = journalData;

  return (
    <Modal visible={isVisible} transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome name="close" size={24} color="white" />
        </TouchableOpacity>
        <Swiper style={styles.wrapper} showsButtons={true}>
          <View style={styles.slide}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            <Svg style={styles.textOverlay}>
              <SvgText x="50%" y="40%" textAnchor="middle" fontSize="24" fill="white">
                {date}
              </SvgText>
              <SvgText x="50%" y="50%" textAnchor="middle" fontSize="24" fill="white">
                {entry}
              </SvgText>
            </Svg>
          </View>
        </Swiper>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
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

export default JournalEntryPreviewModal;
