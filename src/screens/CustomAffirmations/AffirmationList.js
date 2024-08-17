import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';

const AffirmationList = ({ navigation }) => {
  const [affirmation, setAffirmation] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [recording, setRecording] = useState(null);
  const [voiceClip, setVoiceClip] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log("Image uploaded successfully:", result.assets[0].uri);
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
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        setRecording(recording);
        console.log('Recording started');
      } else {
        alert('Permission to access microphone is required!');
      }
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setVoiceClip(uri);
      setRecording(null);
      console.log('Recording stopped and stored at', uri);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const saveAffirmation = async () => {
    try {
      const affirmationData = {
        affirmation,
        image,
        voiceClip,
      };
      await AsyncStorage.setItem('currentAffirmation', JSON.stringify(affirmationData));
      setModalVisible(true);
    } catch (error) {
      console.error('Error saving affirmation: ', error);
    }
  };

  const saveTitle = async () => {
    setLoading(true);
    try {
      const existingTitles = await AsyncStorage.getItem('affirmationTitles');
      const titles = existingTitles ? JSON.parse(existingTitles) : [];
      titles.push(title);
      await AsyncStorage.setItem('affirmationTitles', JSON.stringify(titles));
      // Save affirmation under the new title
      const affirmationData = {
        affirmation,
        image,
        voiceClip,
      };
      await AsyncStorage.setItem(title, JSON.stringify([affirmationData]));
      setModalVisible(false);
      navigation.navigate('Custom Affirmation');
    } catch (error) {
      console.error('Error saving title: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
      {voiceClip && <Text style={styles.voiceClipText}>Voice clip recorded</Text>}
      <TouchableOpacity style={styles.nextButton} onPress={saveAffirmation}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Title</Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={(text) => setTitle(text)}
              style={styles.modalInput}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
              <TouchableOpacity style={styles.saveButton} onPress={saveTitle}>
                <Text style={styles.saveButtonText}>Save Title</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: '#f9f9f9',
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
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  voiceClipText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AffirmationList;
