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
  Platform // Import Platform from react-native
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AntDesign, FontAwesome, MaterialCommunityIcons  } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons from react-native-vector-icons
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from expo


// const images = [
//   require('../../../assets/users/user.jpg'),
// ];

const ProfileScreen = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [editedUserName, setEditedUserName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    getPermissionAsync(); // Ask for permission when component mounts
    fetchData(); // Fetch data when component mounts
    getTotalPoints();
  }, []);

  const fetchData = async () => {
    try {
      const storedUserName = await AsyncStorage.getItem('userName');
      const storedSelectedCategory = await AsyncStorage.getItem('selectedCategory');
      const storedSleepWakeReminder = await AsyncStorage.getItem('sleepWakeReminder');
      const storedAvatarUri = await AsyncStorage.getItem('selectedAvatarUri'); // Retrieve stored image URI
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

      if (storedAvatarUri) {
        setSelectedAvatar(storedAvatarUri); // Set the stored image URI as selectedAvatar
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  const getTotalPoints = async () => {
    try {
      const totalPoints = await AsyncStorage.getItem('userScore');
      if (totalPoints !== null) {
        setTotalPoints(parseInt(totalPoints));
      }
    } catch (error) {
      console.error('Error fetching total points:', error);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log('Image picker result:', result); // Log the result object
      if (!result.cancelled && result.assets.length > 0) {
        setSelectedAvatar(result.assets[0].uri);
        await AsyncStorage.setItem('selectedAvatarUri', result.assets[0].uri); // Save the uploaded image URI into AsyncStorage
        console.log('Image uploaded successfully:', result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [route.params])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.headerText}>User Profile</Text> */}
      <TouchableOpacity style={styles.totalPointsContainer} onPress={() => navigation.navigate('AllPoints')}>
        <Text style={styles.totalPointsText}>Points : {totalPoints}{' '}
         <MaterialCommunityIcons name="star" size={20} color="#4CAF50" />
        </Text>
    </TouchableOpacity>
      <View style={styles.avatarContainer}>
  {selectedAvatar ? (
    typeof selectedAvatar === 'string' ? (
      <Image source={{ uri: selectedAvatar }} style={styles.avatarImage} />
    ) : (
      <Image source={selectedAvatar} style={styles.avatarImage} />
    )
  ) : (
    <TouchableOpacity onPress={pickImage} style={styles.pickImage}>
      <FontAwesome name="image" size={50} color="#4CAF50" style={styles.icon} />
    </TouchableOpacity>
  )}
  <TouchableOpacity onPress={pickImage}>
      <FontAwesome name="camera" size={18} color="#4CAF50" style={styles.icon} />
    </TouchableOpacity>
</View>
      <View style={styles.profileInfo}>
        <View style={styles.row}>
          <View style={styles.leftLine} />
          <FontAwesome name="user" size={18} color="#4CAF50" style={styles.icon} />
          <Text style={styles.label}>Username    :</Text>
          <View style={styles.userContent}>
          <Text style={styles.uservalue}>  {userName}</Text>
          </View>

        </View>
        <View style={styles.row}>
          <View style={styles.leftLine} />
          <FontAwesome name="tag" size={18} color="#4CAF50" style={styles.icon} />
          <View style={styles.centerContent}>
            <Text style={styles.label}>Your Type    :  </Text>
            <Text style={styles.value}>{selectedCategory}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.leftLine} />
          <FontAwesome name="clock-o" size={18} color="#4CAF50" style={styles.icon} />
          <View style={styles.centerContent}>
            <Text style={styles.label}>Sleep Time  : </Text>
            <Text style={styles.value}> {sleepTime}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.leftLine} />
          <FontAwesome name="sun-o" size={18} color="#4CAF50" style={styles.icon} />
          <View style={styles.centerContent}>
            <Text style={styles.label}>Wake Time : </Text>
            <Text style={styles.value}> {wakeTime}</Text> 
          </View>
        </View>
      </View>

            {/* <TouchableOpacity style={styles.reminderButton} onPress={() => navigation.navigate('Journal Home')}>
            <FontAwesome name="book" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Gratitude Journals</Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('MyMood')}>
            <Icon name="analytics" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Mood Analytics</Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('VisionList')}>
            <FontAwesome name="bullseye" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Vision Board</Text>
            </TouchableOpacity> */}
            
            {/* <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('View Habits')}>
              <FontAwesome name="list" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>My Habits</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.reminderButton} onPress={() =>  navigation.navigate('Scheduled Notifications')}>
              <AntDesign name="clockcircle" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Affirmation Reminders</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reminderButton} onPress={() =>  navigation.navigate('DayJournal')}>
              <AntDesign name="calendar" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Journal Calendar</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('AllPoints')}>
            <MaterialCommunityIcons name="star" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>My Points</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('FullDoc')}>
              <FontAwesome name="file" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Documentation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings Screen')}>
              <FontAwesome name="cog" size={24} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',

  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    //marginBottom: 20,
    color: '#4CAF50',
  },
  totalPointsContainer: {
    position: 'absolute',
    top: 60,
    right: 38,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
    // padding: 10,
    // borderRadius: 5,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  totalPointsText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    // marginTop:5
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
  deleteButton: {
    flexDirection: 'row',
    marginTop: 15,
    width: '80%',
    padding: 15,
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
    marginTop: 20,
    width: '80%',
    padding: 15,
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
    padding: 15,
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
    marginTop: 20,
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
  pickImage:{
    //marginLeft: 30,
    marginLeft:20
  }
});

export default ProfileScreen;
