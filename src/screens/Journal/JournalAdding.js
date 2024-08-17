import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ScrollView, ActivityIndicator, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

import ColorPalette from './ColorPalette'; // Assuming you have a ColorPalette component
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook for navigation
import { CalendarList } from 'react-native-calendars'; // Import CalendarList component from react-native-calendars
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from expo-image-picker
import { Audio } from 'expo-av';
import JournalInstruction from '../Documentation/JournalInstruction'; // Import InstructionDoc component

const JournalAdding = () => {
  const navigation = useNavigation(); // Initialize navigation hook
  const [newJournal, setNewJournal] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showJournalMessage, setShowJournalMessage] = useState(true);
  const [journalMessageText, setJournalMessageText] = useState("Write your own journal");
  const [themeColor, setThemeColor] = useState('white');
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [recording, setRecording] = useState(null);
  const [voiceClip, setVoiceClip] = useState(null);

  const checkInstructionsSeen = useCallback(async () => {
    try {
      const instructionsSeen = await AsyncStorage.getItem('instructionsSeenJournal');
      if (!instructionsSeen) {
        setShowInstructions(true);
        await AsyncStorage.setItem('instructionsSeenJournal', 'true');
      }
    } catch (error) {
      console.error('Error checking instructions seen:', error);
    }
  }, []);

  useEffect(() => {
    checkInstructionsSeen();
    setCurrentDate(new Date());
    // Load theme color from AsyncStorage when component mounts
    loadThemeColor();
  }, [checkInstructionsSeen]);

  // useEffect(() => {

  // }, []);

  // Function to load theme color from AsyncStorage
  const loadThemeColor = async () => {
    try {
      const savedThemeColor = await AsyncStorage.getItem('themeColor');
      if (savedThemeColor !== null) {
        setThemeColor(savedThemeColor);
      }
    } catch (error) {
      console.error('Error loading theme color:', error);
    }
  };

  // Function to save theme color to AsyncStorage
  const saveThemeColor = async (color) => {
    try {
      await AsyncStorage.setItem('themeColor', color);
    } catch (error) {
      console.error('Error saving theme color:', error);
    }
  };

  const formatDate = (date) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const saveJournal = async () => {
    try {
      // Set loading to true while saving the journal
      setIsLoading(true);
      const storedJournals = await AsyncStorage.getItem('gratitudeJournals');
      let journals = [];
      if (storedJournals !== null) {
        journals = JSON.parse(storedJournals);
      }
      journals.push({ date: formatDate(currentDate), entry: newJournal, image: image, voiceClip: voiceClip });
      await AsyncStorage.setItem('gratitudeJournals', JSON.stringify(journals));
      // Give points when saving journal
      givePoints(1);
      // After saving the journal, navigate to Journal Home
      navigation.navigate('Journal Home');
    } catch (error) {
      console.error('Error saving journal:', error);
    } finally {
      // Set loading to false after saving completes (whether success or error)
      setIsLoading(false);
    }
  };

  const givePoints = async (pointsToAdd) => {
    try {
      // Fetch current points from AsyncStorage
      const currentPoints = await AsyncStorage.getItem('journalPoints');
      let updatedPoints = 0;

      // If currentPoints is not null, parse it to integer
      if (currentPoints !== null) {
        updatedPoints = parseInt(currentPoints);
      }

      // Add the new points to the current points
      updatedPoints += pointsToAdd;

      // Save the updated points back to AsyncStorage
      await AsyncStorage.setItem('journalPoints', updatedPoints.toString());

      console.log(`Points added: ${pointsToAdd}`);
    } catch (error) {
      console.error('Error giving points:', error);
    }
  };

  const changeThemeColor = (color) => {
    setThemeColor(color);
    saveThemeColor(color); // Save selected color to AsyncStorage
  };

  const toggleColorPalette = () => {
    setShowColorPalette(!showColorPalette);
  };

  const closeModal = () => {
    setShowInstructions(false);
  };

  const refreshJournalMessage = () => {
    const messages = ["How was your day?", "What are you grateful today?", "Express yourself!", "Let's capture your thoughts"];
    const randomIndex = Math.floor(Math.random() * messages.length);
    setJournalMessageText(messages[randomIndex]);
  };

  const navigateToDayJournal = () => {
    navigation.navigate('DayJournal');
  };

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
    console.log(result);
    if (!result.cancelled) {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.calendarButton} onPress={navigateToDayJournal}>
          <Icon name="calendar" size={25} color="#575959" style={styles.calendarIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerButtonText}>{`Today ${formatDate(currentDate)}`}</Text>
          <Icon name="caret-down" size={20} color="#575959" style={styles.dropdownIcon} />
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            setCurrentDate(selectedDate || currentDate);
          }}
        />
      )}
      {showJournalMessage && (
        <View style={styles.journalMessageContainer}>
          <Text style={styles.journalMessageText}>{journalMessageText}</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={refreshJournalMessage}>
              <Icon name="refresh" size={20} color="black" style={styles.refreshIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowJournalMessage(false)}>
              <Icon name="times-circle" size={20} color="black" style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <ScrollView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Start writing here..."
          onChangeText={(text) => setNewJournal(text)}
          value={newJournal}
          multiline
          numberOfLines={10}
          textAlignVertical="top"
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

        {voiceClip && (
          <View style={styles.voiceClipContainer}>
            <Text style={styles.voiceClipText}>Voice clip recorded</Text>
            <TouchableOpacity onPress={() => setVoiceClip(null)}>
              <Icon name="times-circle" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {isLoading && <ActivityIndicator size="large" color="#4CAF50" />}
      <TouchableOpacity style={styles.sendButton} onPress={saveJournal}>
        <Text style={styles.sendButtonText}>Save Journal</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showInstructions}
        onRequestClose={() => setShowInstructions(false)}
      >
        <JournalInstruction closeModal={closeModal} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginVertical: 30,
  },
  calendarButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 1,
  },
  journalMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  journalMessageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  refreshIcon: {
    marginRight: 20,
  },
  closeIcon: {},
  row: {
    flexDirection: 'row',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  datePickerButtonText: {
    color: '#575959',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
  },
  uploadButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    textAlign: 'center',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  voiceButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  voiceClipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
  },
  voiceClipText: {
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default JournalAdding;
