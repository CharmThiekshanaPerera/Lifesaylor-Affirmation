import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Card, IconButton } from 'react-native-paper'; // Import IconButton
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';

const MyMood = () => {
  const [moodNotes, setMoodNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchMoodNotes();
  }, []);

  const fetchMoodNotes = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const allMoodNotes = await AsyncStorage.multiGet(keys.filter(key => key.startsWith('moodNote')));
    const sortedMoodNotes = allMoodNotes
      .map(item => JSON.parse(item[1]))
      .sort((a, b) => new Date(b.moodData.dateTime) - new Date(a.moodData.dateTime));
    setMoodNotes(sortedMoodNotes);
    setLoading(false); // Set loading to false after fetching data
  };

  const handleAddRecord = () => {
    navigation.navigate('MoodTracker');
  };

  const handleAnalytics = () => {
    navigation.navigate('MoodAnalytics', { moodNotes });
  };

  const handleReset = async () => {
    setShowModal(false); // Hide the modal
    const keys = await AsyncStorage.getAllKeys();
    const moodNoteKeys = keys.filter(key => key.startsWith('moodNote'));
    await AsyncStorage.multiRemove(moodNoteKeys); // Remove only moodNote keys
    fetchMoodNotes(); // Refresh the page by fetching mood notes again
  };

  const handleNavigateToMoodNotesTable = () => {
    navigation.navigate('Mood Table');
  };

  const handleNavigateToChart = () => {
    navigation.navigate('Mood Chart');
  };

  const renderDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return `${dateTime.toDateString()} ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTextDate}>{renderDateTime(item.moodData.dateTime)}</Text>
      <Text style={styles.cardText}>Mood : {item.moodData.moodName} & {item.feeling}</Text>
      <Text style={styles.cardText}>Tags: {item.selectedTags.join(', ')} </Text>
      <Text style={styles.cardText}>Note : {item.note}</Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <Card style={styles.emptyCard}>
      <Card.Content style={styles.emptyCardContent}>
        <Image
          source={require('../../../assets/users/a.png')}
          style={styles.image}
        />
        <Text style={styles.description}>
          No mood records found. Start tracking your mood now!
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleAddRecord}>
          <Text style={styles.buttonText}>Add Mood</Text>
          <Icon name="arrow-right" size={20} color="#fff" style={styles.arrowIcon} />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {moodNotes.length > 0 && (
      <TouchableOpacity style={styles.resetButton} onPress={() => setShowModal(true)}>
        <Text style={styles.resetText}>Reset</Text>
        <MaterialIcons name="refresh" size={24} color="#fff"/>
      </TouchableOpacity>
      )}
      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to reset all mood data?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.resetConfirmButton]} onPress={handleReset}>
                <Text style={styles.modalButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : moodNotes.length === 0 ? (
        renderEmptyComponent()
      ) : (
        <View style={styles.content}>
          <FlatList
            data={moodNotes}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.list}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddRecord}>
            <MaterialIcons name="add" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          {moodNotes.length > 0 && (
            <TouchableOpacity style={styles.analyticsButton} onPress={handleNavigateToChart}>
              <MaterialIcons name="analytics" size={24} color="#fff"/>
            </TouchableOpacity>
          )}

          {/* Button to navigate to MoodNotesTable */}
          {/* <IconButton
            icon="format-list-bulleted"
            color="#fff"
            size={30}
            style={styles.notesTableButton}
            onPress={handleAnalytics}
          /> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginVertical: 30,
  },
  content: {
    flex: 1,
    position: 'relative', // Needed for positioning the buttons
    marginTop: 50,
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  emptyCard: {
    marginVertical: '50%',
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  emptyCardContent: {
    alignItems: 'center',
  },
  cardTextDate: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  addButton: {
    position: 'absolute',
    bottom: -6,
    right: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  analyticsButton: {
    position: 'absolute',
    bottom: -6,
    left: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  notesTableButton: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    transform: [{ translateX: -25 }], // Adjust as needed
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  resetButton: {
    position: 'absolute',
    top: 15,
    right: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  resetText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  resetConfirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: 'grey',
  },
});

export default MyMood;
