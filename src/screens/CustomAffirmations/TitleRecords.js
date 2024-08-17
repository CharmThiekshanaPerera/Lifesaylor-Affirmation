import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';

const TitleRecords = ({ route, navigation }) => {
  const { title } = route.params;
  const [records, setRecords] = useState([]);
  const [sound, setSound] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);

  useEffect(() => {
    fetchRecords();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const fetchRecords = async () => {
    try {
      const storedRecords = await AsyncStorage.getItem(title);
      if (storedRecords !== null) {
        setRecords(JSON.parse(storedRecords));
        console.log(storedRecords); // Verify URIs here
      }
    } catch (error) {
      console.error('Error fetching records: ', error);
    }
  };

  const playSound = async (uri, index) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setPlayingIndex(null);
      }
      setPlayingIndex(index);
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingIndex(null);
        }
      });
    } catch (error) {
      console.error('Error playing sound: ', error);
      setPlayingIndex(null);
    }
  };

  const stopSound = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setPlayingIndex(null);
        setSound(null);
      }
    } catch (error) {
      console.error('Error stopping sound: ', error);
    }
  };

  const deleteRecord = async (index) => {
    try {
      const updatedRecords = [...records];
      updatedRecords.splice(index, 1);
      await AsyncStorage.setItem(title, JSON.stringify(updatedRecords));
      setRecords(updatedRecords);
    } catch (error) {
      console.error('Error deleting record: ', error);
    }
  };

  const confirmDeleteRecord = (index) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this record?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Delete', onPress: () => deleteRecord(index) },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {records.length === 0 ? (
          <Text style={styles.noRecordsText}>No records found.</Text>
        ) : (
          records.map((record, index) => (
            <View key={index} style={styles.recordContainer}>
              <Text style={styles.recordText}>{record.affirmation}</Text>
              {record.image && (
                <Image source={{ uri: record.image }} style={styles.recordImage} />
              )}
              {record.voiceClip && (
                <View style={styles.voiceButtonContainer}>
                  <TouchableOpacity
                    style={styles.voiceButton}
                    onPress={() => playSound(record.voiceClip, index)}
                    disabled={playingIndex === index}
                  >
                    <Icon name={playingIndex === index ? 'pause' : 'play'} size={25} color="#4CAF50" />
                    <Text style={styles.playText}>{playingIndex === index ? 'Playing...' : 'Play Voice Clip'}</Text>
                  </TouchableOpacity>
                  {playingIndex === index && (
                    <TouchableOpacity style={styles.stopButton} onPress={stopSound}>
                      <Icon name="stop" size={25} color="#f44336" />
                      <Text style={styles.stopText}>Stop</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {playingIndex === index && <ActivityIndicator size="small" color="#4CAF50" />}
              <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteRecord(index)}>
                <Icon name="trash" size={25} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Add Record', { title })}
      >
        <Icon name="plus" size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginTop:20
  },
  scrollViewContent: {
    paddingBottom: 100, // To ensure content does not get hidden behind the add button
  },
  noRecordsText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  recordContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative',
  },
  recordText: {
    fontSize: 18,
    color: '#444',
    marginBottom: 10,
  },
  recordImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  voiceButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e0f7fa',
    flex: 1,
    marginRight: 10,
  },
  playText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#00796b',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffcdd2',
  },
  stopText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#d32f2f',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default TitleRecords;
