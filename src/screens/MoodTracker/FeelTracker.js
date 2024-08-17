// FeelTracker.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FeelTracker = ({ route, navigation }) => {
  const { filteredFeelings } = route.params;

  const saveFeeling = async (feeling) => {
    try {
      await AsyncStorage.setItem('feeling', feeling);
      navigation.navigate('MoodTags');
    } catch (error) {
      console.log('Error saving feeling:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        {filteredFeelings.map((feeling, index) => (
          <TouchableOpacity
            key={index}
            style={styles.feelingCard}
            onPress={() => saveFeeling(feeling)}
          >
            <Text style={styles.feelingText}>{feeling}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    marginTop:50
  },
  feelingCard: {
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  feelingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeelTracker;
