import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card } from 'react-native-paper';
import JournalEntryPreviewModal from './JournalSlideshow'; // Import the modal component for previewing journal entries
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av'; // Import Audio component from expo-av

const JournalHome = ({ navigation }) => {
  const [journals, setJournals] = useState([]);
  const [isLoadingJournals, setIsLoadingJournals] = useState(true); // State to track loading journals
  const [isLoading, setIsLoading] = useState(false); // State to track overall loading
  const [userName, setUserName] = useState('');
  const [selectedJournal, setSelectedJournal] = useState(null); // State to store the selected journal for preview modal
  const [sound, setSound] = useState(null); // State to manage audio playback

  const loadUserName = useCallback(async () => {
    try {
      const savedUserName = await AsyncStorage.getItem('userName');
      if (savedUserName !== null) {
        setUserName(savedUserName);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  }, []);

  useEffect(() => {
    retrieveJournals();
    loadUserName();
  }, [loadUserName]);

  const retrieveJournals = async () => {
    try {
      setIsLoading(true); // Set overall loading to true
      const storedJournals = await AsyncStorage.getItem('gratitudeJournals');
      if (storedJournals !== null) {
        setJournals(JSON.parse(storedJournals));
      }
      setIsLoading(false); // Set overall loading to false
      setIsLoadingJournals(false); // Set loading journals to false
    } catch (error) {
      console.error('Error retrieving journals:', error);
      setIsLoading(false); // Set overall loading to false
      setIsLoadingJournals(false); // Set loading journals to false
    }
  };

  const deleteJournal = async (index) => {
    try {
      const updatedJournals = [...journals];
      updatedJournals.splice(index, 1);
      setJournals(updatedJournals);
      await AsyncStorage.setItem('gratitudeJournals', JSON.stringify(updatedJournals));
    } catch (error) {
      console.error('Error deleting journal:', error);
    }
  };

  const handleNavigateToSample = () => {
    navigation.navigate('Journal Adding');
  };

  const handleNavigateToSlideshow = (item) => {
    if (item && item.date && item.image && item.entry) {
      navigation.navigate('JournalSlideshow', {
        date: item.date,
        image: item.image,
        entry: item.entry,
      });
    } else {
      console.error('Invalid item data:', item);
    }
  };

  const playSound = async (uri) => {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  };

  const stopSound = async () => {
    console.log('Stopping Sound');
    await sound.stopAsync();
    setSound(null);
  };

  useEffect(() => {
    return sound ? () => {
      console.log('Unloading Sound');
      sound.unloadAsync();
    } : undefined;
  }, [sound]);

  const renderEmptyComponent = () => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image
          source={require('../../../assets/users/a.png')}
          style={styles.image}
        />
        <Text style={styles.description}>
          Start your gratitude journey today by adding your first journal entry!
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleNavigateToSample}>
          <Text style={styles.buttonText}>Add Journal</Text>
          <Icon name="arrow-right" size={20} color="#fff" style={styles.arrowIcon} />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  const renderItem = ({ item, index }) => (
    <Card style={styles.cardMain}>
      <Card.Content>
        <Text style={styles.date}>{item.date}</Text>
        <View style={styles.row}>
          {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
          <Text style={styles.entry}>{item.entry}</Text>
        </View>
        <View style={styles.rowdata}>
        {item.voiceClip && (
            <TouchableOpacity
              style={styles.audioButton}
              onPress={sound ? stopSound : () => playSound(item.voiceClip)}
            >
              <Icon name={sound ? 'stop' : 'play'} size={20} color="#4CAF50" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.playButton} onPress={() => setSelectedJournal(item)}>
            <Icon name="eye" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteJournal(index)}>
            <Icon name="trash" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const renderAddButton = () => (
    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Journal Adding')}>
      <MaterialIcons name="add" size={30} color="#FFFFFF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="green" />
      ) : isLoadingJournals ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <FlatList
          data={journals}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
      {journals.length > 0 && renderAddButton()}
      {selectedJournal && (
        <JournalEntryPreviewModal
          isVisible={!!selectedJournal}
          onClose={() => setSelectedJournal(null)}
          journalData={selectedJournal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    marginVertical: '50%',
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  cardMain: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  entry: {
    flex: 1,
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
  rowdata: {
    position: 'absolute',
    right: 10,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  playButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginRight: 10,
  },
  audioButton: {
    marginRight: 10,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  description: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
});


export default JournalHome;
