import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const [habitPoints, setHabitPoints] = useState(0);
  const [journalPoints, setJournalPoints] = useState(0);
  const [moodPoints, setMoodPoints] = useState(0);
  const [visionPoints, setVisionPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    getPoints();
  }, []);

  useEffect(() => {
    const sumPoints = habitPoints + journalPoints + moodPoints + visionPoints;
    setTotalPoints(sumPoints);
    saveTotalPoints(sumPoints); // Save total points to AsyncStorage
  }, [habitPoints, journalPoints, moodPoints, visionPoints]);

  const getPoints = async () => {
    try {
      const habitPoints = await AsyncStorage.getItem('habitPoints');
      const journalPoints = await AsyncStorage.getItem('journalPoints');
      const moodPoints = await AsyncStorage.getItem('moodPoints');
      const visionPoints = await AsyncStorage.getItem('visionPoints');

      setHabitPoints(habitPoints ? parseInt(habitPoints) : 0);
      setJournalPoints(journalPoints ? parseInt(journalPoints) : 0);
      setMoodPoints(moodPoints ? parseInt(moodPoints) : 0);
      setVisionPoints(visionPoints ? parseInt(visionPoints) : 0);
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  const saveTotalPoints = async (points) => {
    try {
      await AsyncStorage.setItem('userScore', points.toString());
    } catch (error) {
      console.error('Error saving total points:', error);
    }
  };

  const PointCard = ({ title, points, icon, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <FontAwesome5 name={icon} size={40} color="#4CAF50" style={styles.icon} />
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{points} Points</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const navigateToLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Points</Text>
      <PointCard
        title="Habit"
        points={habitPoints}
        icon="chart-line"
        onPress={() => navigation.navigate('HabitPoints')}
      />
      <PointCard
        title="Journal"
        points={journalPoints}
        icon="book"
        onPress={() => navigation.navigate('JournalPoints')}
      />
      <PointCard
        title="Mood"
        points={moodPoints}
        icon="smile"
        onPress={() => navigation.navigate('MoodPoints')}
      />
      <PointCard
        title="Vision"
        points={visionPoints}
        icon="eye"
        onPress={() => navigation.navigate('VisionPoints')}
      />
      <View style={styles.totalPointsContainer}>
        <Text style={styles.totalPointsText}>Total Points: {totalPoints}</Text>
      </View>
      {/* <TouchableOpacity style={styles.leaderboardButton} onPress={navigateToLeaderboard}>
        <FontAwesome5 name="trophy" size={20} color="#fff" style={styles.leaderboardButtonIcon} />
        <Text style={styles.leaderboardButtonText}>Leaderboard</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-between', // Aligns items horizontally
  },
  icon: {
    marginRight: 20,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Added to space items horizontally
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  totalPointsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  totalPointsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  leaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the content horizontally
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    marginTop: 100,
  },
  leaderboardButtonIcon: {
    marginRight: 10,
    alignSelf: 'center', // Center the icon vertically
  },
  leaderboardButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center', // Center the text vertically
  },
});

export default Profile;
