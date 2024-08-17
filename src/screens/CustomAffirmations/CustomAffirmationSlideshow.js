import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AffirmationSlideshow = ({ route, navigation }) => {
  const { title } = route.params;
  const [records, setRecords] = useState([]);
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchRecords();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (records.length > 0 && currentRecordIndex < records.length) {
      playRecord(records[currentRecordIndex]);
    }
  }, [currentRecordIndex, records]);

  const fetchRecords = async () => {
    try {
      const storedRecords = await AsyncStorage.getItem(title);
      if (storedRecords !== null) {
        setRecords(JSON.parse(storedRecords));
      }
    } catch (error) {
      console.error('Error fetching records: ', error);
    }
  };

  const playRecord = async (record) => {
    if (sound) {
      await sound.unloadAsync();
    }
    if (record.voiceClip) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: record.voiceClip });
        setSound(newSound);
        setIsPlaying(true);
        await newSound.playAsync();
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            nextRecord();
          }
        });
      } catch (error) {
        console.error('Error playing sound: ', error);
        nextRecord();
      }
    } else {
      nextRecord();
    }
  };

  const stopRecord = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const nextRecord = () => {
    if (currentRecordIndex < records.length - 1) {
      setCurrentRecordIndex(currentRecordIndex + 1);
    } else {
      setCurrentRecordIndex(0);
    }
  };

  return (
    <View style={styles.container}>
      {records.length === 0 ? (
        <Text style={styles.noRecordsText}>No records found.</Text>
      ) : (
        <ImageBackground source={{ uri: records[currentRecordIndex].image }} style={styles.recordImage}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <View style={styles.overlay}>
            <Text style={styles.recordText}>{records[currentRecordIndex].affirmation}</Text>
            <View style={styles.controls}>
              <TouchableOpacity style={[styles.controlButton, styles.nextButton]} onPress={nextRecord}>
                <Icon name="arrow-left" size={25} color="#fff" />
              </TouchableOpacity>
              {records[currentRecordIndex].voiceClip && (
                isPlaying ? (
                  <TouchableOpacity style={[styles.controlButton, styles.stopButton]} onPress={stopRecord}>
                    <Icon name="stop" size={25} color="#fff" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.controlButton, styles.playButton]} onPress={() => playRecord(records[currentRecordIndex])}>
                    <Icon name="play" size={25} color="#fff" />
                  </TouchableOpacity>
                )
              )}
              <TouchableOpacity style={[styles.controlButton, styles.nextButton]} onPress={nextRecord}>
                <Icon name="arrow-right" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  noRecordsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  recordImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  recordText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    top:'80%'
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  controlButton: {
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
});

export default AffirmationSlideshow;
