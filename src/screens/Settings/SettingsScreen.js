import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const images = [
  require('../../../assets/users/user.jpg'),
  // Add more images as needed
];

const ProfileScreen = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [editedUserName, setEditedUserName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const storedUserName = await AsyncStorage.getItem('userName');
      const storedSelectedCategory = await AsyncStorage.getItem('selectedCategory');
      const storedSleepWakeReminder = await AsyncStorage.getItem('sleepWakeReminder');
      const storedAvatarIndex = await AsyncStorage.getItem('selectedAvatarIndex');
      const reminder = storedSleepWakeReminder ? JSON.parse(storedSleepWakeReminder) : null;

      if (storedUserName) {
        setUserName(storedUserName);
      }

      if (storedSelectedCategory) {
        setSelectedCategory(storedSelectedCategory);
      }

      if (reminder && reminder.length > 0) {
        setSleepTime(reminder[0].sleepTime);
        setWakeTime(reminder[0].wakeTime);
      }

      if (storedAvatarIndex) {
        setSelectedAvatar(images[parseInt(storedAvatarIndex, 10)]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [route.params])
  );

  const handleEdit = () => {
    setEditedUserName(userName);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await AsyncStorage.setItem('userName', editedUserName);
      setUserName(editedUserName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user name:', error);
    }
  };

  const handleBellIconPress = () => {
    navigation.navigate('Custom Category');
    //navigation.navigate('Scheduled Notifications');
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: handleDeleteAccount, style: 'destructive' },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    try {
      // Remove user data from AsyncStorage
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('selectedCategory');
      await AsyncStorage.removeItem('sleepWakeReminder');
      await AsyncStorage.removeItem('instructionsSeen');
      await AsyncStorage.removeItem('selectedAvatarUri'); // Remove stored avatar URI
      await AsyncStorage.removeItem('instructionsSeenHabit');
      await AsyncStorage.removeItem('instructionsSeenMood');
      await AsyncStorage.removeItem('instructionsSeenJournal');
      await AsyncStorage.removeItem('instructionsSeenVision');


  
      // Reset states
      setUserName('');
      setEditedUserName('');
      setSelectedCategory('');
      setSleepTime('');
      setWakeTime('');
      setIsEditing(false);
  
      // Remove instructionsSeen data
      await AsyncStorage.removeItem('instructionsSeen');
  
      // Fetch data again after deleting the account
      await fetchData();
  
      navigation.navigate('Welcome');
  
      Alert.alert('Account Deleted', 'Your account data has been deleted.');
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'An error occurred while deleting your account. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <View style={styles.row}>
          <View style={styles.leftLine} />
          <FontAwesome name="user" size={18} color="#4CAF50" style={styles.icon} />
          <Text style={styles.label}>Username    :</Text>
          <View style={styles.userContent}>
      
            {isEditing ? 
            (
              <TextInput style={styles.editInput} onChangeText={setEditedUserName} value={editedUserName}/>
            ) : 
            (
              <Text style={styles.uservalue}>  {userName}</Text>
            )}
          </View>

        </View>
      </View>

      {isEditing ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
          <Text style={styles.savebuttonText}>Save</Text>
        </TouchableOpacity>
      ) : (

            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <AntDesign name="edit" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Edit User Name</Text>
            </TouchableOpacity>
            
      )}

            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Category Change')}>
              <FontAwesome name="edit" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Change Affirmation Type</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reminderButton} onPress={handleBellIconPress}>
              <AntDesign name="clockcircle" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Custom Type Reminders</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={showDeleteConfirmation}>
              <AntDesign name="delete" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Delete User</Text>
            </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    marginTop:50,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    //marginBottom: 20,
    color: '#4CAF50',
  },
  profileInfo: {
    width: '80%',
    padding: 20,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop:5
  },
  buttonrow: {
    width: '80%',
    padding: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop:20
  },
  leftLine: {
    width: 5,
    height: '100%',
    //backgroundColor: '#4CAF50',
    //marginRight: 10,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 18,
    color: '#555',
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    //flex: 1,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 5,
    padding: 8,
    width: '70%',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft:5
  },
  uservalue: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    flexDirection: 'row',
    //marginBottom: 10,
    //marginTop:10
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    //marginLeft:10
  },
  savebuttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    //marginLeft:10
  },
  editButton: {
    flexDirection: 'row',
    marginTop: 20,
    width: '80%',
    padding: 20,
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
  deleteButton: {
    flexDirection: 'row',
    marginTop: 15,
    width: '80%',
    padding: 20,
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
  reminderButton: {
    flexDirection: 'row',
    marginTop: 15,
    width: '80%',
    padding: 20,
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
  settingsButton: {
    flexDirection: 'row',
    marginTop: 15,
    width: '80%',
    padding: 20,
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
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginLeft: 30,
    marginRight:10
  },
  buttonIcon: {
    alignSelf: 'center', 
    marginRight:10
  },
});

export default ProfileScreen;
