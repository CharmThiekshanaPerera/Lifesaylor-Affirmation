import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const VisionMain = () => {
  const [visionData, setVisionData] = useState(null);
  const [visionBoardName, setVisionBoardName] = useState('');
  const [visionSectionName, setVisionSectionName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadVisionData = async () => {
      try {
        const savedVisionBoardName = await AsyncStorage.getItem('visionBoardName');
        const savedVisionSectionName = await AsyncStorage.getItem('visionSection');
        if (savedVisionBoardName) {
          setVisionBoardName(savedVisionBoardName);
        }
        if (savedVisionSectionName) {
          setVisionSectionName(savedVisionSectionName);
        }

        const savedVisionData = await AsyncStorage.getItem('visionData');
        if (savedVisionData) {
          setVisionData(JSON.parse(savedVisionData));
        }
      } catch (error) {
        console.error("Error loading vision data:", error);
      }
    };

    loadVisionData();
  }, []);

  const givePoints = async (pointsToAdd) => {
    try {
      // Fetch current points from AsyncStorage
      const currentPoints = await AsyncStorage.getItem('visionPoints');
      let updatedPoints = 0;

      // If currentPoints is not null, parse it to integer
      if (currentPoints !== null) {
        updatedPoints = parseInt(currentPoints);
      }

      // Add the new points to the current points
      updatedPoints += pointsToAdd;

      // Save the updated points back to AsyncStorage
      await AsyncStorage.setItem('visionPoints', updatedPoints.toString());

      console.log(`Points added: ${pointsToAdd}`);
    } catch (error) {
      console.error('Error giving points:', error);
    }
  };

  const handleSaveButtonPress = async () => {
    try {
      const existingVisionList = await AsyncStorage.getItem('visionList');
      const parsedExistingVisionList = existingVisionList ? JSON.parse(existingVisionList) : [];
      const updatedVisionList = [...parsedExistingVisionList, { visionBoardName, visionSectionName, visionData }];
      await AsyncStorage.setItem('visionList', JSON.stringify(updatedVisionList));
      givePoints(1); // Add one point when vision data is saved
      navigation.navigate('VisionList');
    } catch (error) {
      console.error('Error saving vision data:', error);
    }
  };

  const handlePreviewButtonPress = () => {
    navigation.navigate('VisionSlideshow', { visionBoardName, visionSectionName, visionData });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{visionBoardName} with {visionSectionName}</Text>
      {/* <Text style={styles.subHeader}>With</Text>
      <Text style={styles.subHeaderTwo}>{visionSectionName}</Text> */}
      
      {visionData ? (
        <View style={styles.visionContainer}>
          {/* <Text style={styles.subHeader}>{visionBoardName} with {visionSectionName}</Text> */}
          <View style={styles.imageContainer}>
            {visionData.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </View>
          <Text style={styles.description}>{visionData.description}</Text>
        </View>
      ) : (
        <Text>No vision data available</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveButtonPress}>
          <Text style={styles.buttonText}>Save Data</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#555',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeaderTwo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visionContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom:10,
    padding:40,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  images: {
    fontSize: 18,
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VisionMain;
