import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddRecord = ({ route, navigation }) => {
  const { title } = route.params;
  const [affirmation, setAffirmation] = useState('');
  const [image, setImage] = useState(null);
  const [recording, setRecording] = useState(null);
  const [voiceClip, setVoiceClip] = useState(null);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const recordingInstance = new Audio.Recording();
        await recordingInstance.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recordingInstance.startAsync();
        setRecording(recordingInstance);
      } else {
        alert('Permission to access microphone is required!');
      }
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) {
        return;
      }
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setVoiceClip(uri);
      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const saveRecord = async () => {
    try {
      const storedRecords = await AsyncStorage.getItem(title);
      const records = storedRecords ? JSON.parse(storedRecords) : [];
      records.push({ affirmation, image, voiceClip });
      await AsyncStorage.setItem(title, JSON.stringify(records));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving record: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        placeholder="Enter your affirmation"
        value={affirmation}
        onChangeText={(text) => setAffirmation(text)}
        style={styles.input}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Icon name="image" size={25} color="#4CAF50" />
        <Text style={styles.uploadButtonText}>Upload Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}
      <TouchableOpacity
        style={styles.voiceButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <Icon name={recording ? 'stop' : 'microphone'} size={25} color="#4CAF50" />
        <Text style={styles.uploadButtonText}>{recording ? 'Stop Recording' : 'Record Voice'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={saveRecord}>
        <Text style={styles.saveButtonText}>Save Record</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginTop:20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top', // ensures the text starts at the top
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#e0f7e0',
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#4CAF50',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#e0f7e0',
    borderRadius: 5,
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddRecord;
