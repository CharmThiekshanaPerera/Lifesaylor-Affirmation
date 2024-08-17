import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const VisionImageScreen = () => {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
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
      } catch (error) {
        console.error("Error loading vision data:", error);
      }
    };

    loadVisionData();
  }, []);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      multiple: true,
    });

    console.log("Image picker result:", result);

    if (!result.cancelled) {
      if (result.assets && result.assets.length > 0) {
        const uploadedImages = result.assets.map(asset => asset.uri);
        setImages(prevImages => [...prevImages, ...uploadedImages]);
        console.log("Images uploaded successfully:", uploadedImages);
      } else {
        console.log("No image assets found in the result.");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        images,
        description
      };
      await AsyncStorage.setItem('visionData', JSON.stringify(data));
      console.log("Data saved successfully:", data);
      navigation.navigate('VisionMain');
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Failed to save data!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.headerText}>Upload Images And Description</Text>
      </View>
      {/* <Text style={styles.subHeaderText}>With</Text> */}
      <Text style={styles.subHeaderTextTwo}>{visionBoardName} with {visionSectionName}</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
      <FontAwesome name="plus" size={20} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.uploadText}>Add More Images</Text>
        <FontAwesome name="image" size={20} color="#fff" style={{ marginRight: 10 }} />
      </TouchableOpacity>
      <ScrollView>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Add Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {images.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.imagePreview} />
        ))}
      </ScrollView>
      {images.length > 0 && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Changed background color
    padding: 20,
    marginTop:50
  },
  header: {
    marginBottom: 20,
    marginTop:20
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 24, // Increased font size
    fontWeight: 'bold',
    color: '#4CAF50', // Changed text color
  },
  headerTextTwo: {
    fontSize: 24,
    fontWeight: 'bold',
    //marginBottom: 10,
    color: '#333', // Changed text color
  },
  subHeaderText: {
    fontSize: 18,
    marginTop: 10,
    color: '#555', // Changed text color
  },
  subHeaderTextTwo: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 10,
    color: '#555', // Changed text color
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 20,
    flexDirection: 'row'
    //marginTop: 20
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight:10
  },
  imagePreview: {
    width: '100%', // Adjusted width to fit the screen
    height: 200,
    marginBottom: 10,
    borderRadius: 10, // Added border radius
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 100,
    marginBottom: 20,
    width: '100%', // Adjusted width to fit the screen
    marginLeft: 0,
    marginRight: 200
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 10,
    marginTop:20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VisionImageScreen;
