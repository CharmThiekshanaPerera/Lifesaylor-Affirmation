// ColorPalette.js

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const ColorPalette = ({ onSelect }) => {
  const colors = ['#fff', '#2196F3', '#FF5722', '#607D8B']; // Example colors

  return (
    <View style={styles.container}>
      {colors.map((color, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.colorOption, { backgroundColor: color }]}
          onPress={() => onSelect(color)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flexDirection: 'row',
    justifyContent: 'space-around',
    //marginTop: 10,
    marginHorizontal:-10,

  },
  colorOption: {
    width: 25,
    height: 25,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1.5,
    marginBottom:5
  },
});

export default ColorPalette;
