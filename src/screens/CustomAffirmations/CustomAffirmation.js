import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const CustomAffirmation = ({ navigation }) => {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTitles();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchTitles();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchTitles = async () => {
    setLoading(true);
    try {
      const storedTitles = await AsyncStorage.getItem('affirmationTitles');
      console.log('Fetched titles:', storedTitles);
      if (storedTitles !== null) {
        setTitles(JSON.parse(storedTitles));
      }
    } catch (error) {
      console.error('Error fetching titles: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitlePress = (title) => {
    navigation.navigate('Title Records', { title });
  };

  const handleDeleteTitle = (title) => {
    Alert.alert(
      "Delete Confirmation",
      `Are you sure you want to delete the title "${title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const filteredTitles = titles.filter(item => item !== title);
              setTitles(filteredTitles);
              await AsyncStorage.setItem('affirmationTitles', JSON.stringify(filteredTitles));
            } catch (error) {
              console.error('Error deleting title: ', error);
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleReminderPress = (title, index) => {
    console.log(`Navigating to TestReminderScreen with categoryName: ${title}, categoryId: ${index}`);
    navigation.navigate('Test Reminder', { categoryName: title, categoryId: index });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {titles.length === 0 ? (
        <Text style={styles.emptyText}>No affirmation lists created yet.</Text>
      ) : (
        titles.map((title, index) => (
          <View key={index} style={styles.titleContainer}>
            <TouchableOpacity
              onPress={() => handleTitlePress(title)}
              style={styles.titleContent}
            >
              <Text style={styles.titleText}>{title}</Text>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SlideshowScreen', { title })}
                style={styles.slideshowButton}
              >
                <Ionicons name="eye" size={24} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteTitle(title)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={24} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleReminderPress(title, index)}
                style={styles.reminderButton}
              >
                <Ionicons name="notifications" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Affirmation List')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  titleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slideshowButton: {
    padding: 5,
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  reminderButton: {
    padding: 5,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 40,
    color: '#fff',
    lineHeight: 50,
  },
});

export default CustomAffirmation;
