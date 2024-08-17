import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Leaderboard = () => {
  const [myScore, setMyScore] = useState(0);
  const [myName, setMyName] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyData();
    getLeaderboardData();
  }, []);

  const getMyData = async () => {
    try {
      const userName = await AsyncStorage.getItem('userName');
      const userScore = await AsyncStorage.getItem('userScore');

      console.log('My Name:', userName);
      console.log('My Score:', userScore);

      setMyName(userName);
      setMyScore(userScore ? parseInt(userScore) : 0);
    } catch (error) {
      console.error('Error fetching my data:', error);
    }
  };

  const getLeaderboardData = async () => {
    try {
      const leaderboard = [
        { id: '1', name: 'John Doe', score: 250, avatar: require('../../../assets/users/user.jpg') },
        { id: '2', name: 'Jane Smith', score: 200, avatar: require('../../../assets/users/user.jpg') },
        { id: '3', name: 'Alex Johnson', score: 180, avatar: require('../../../assets/users/user.jpg') },
        { id: '4', name: 'Emily Brown', score: 150, avatar: require('../../../assets/users/user.jpg') },
        { id: '5', name: 'Michael Wilson', score: 120, avatar: require('../../../assets/users/user.jpg') },
        { id: '6', name: 'Sophia Martinez', score: 100, avatar: require('../../../assets/users/user.jpg') },
        { id: '7', name: 'William Anderson', score: 80, avatar: require('../../../assets/users/user.jpg') },
        { id: '8', name: 'Olivia Garcia', score: 60, avatar: require('../../../assets/users/user.jpg') },
        { id: '9', name: 'James Lopez', score: 40, avatar: require('../../../assets/users/user.jpg') },
        { id: '10', name: 'Emma Young', score: 20, avatar: require('../../../assets/users/user.jpg') },
      ];

      // Add my score to the leaderboard data
      const updatedLeaderboard = [...leaderboard, { id: 'user', name: myName, score: myScore, avatar: require('../../../assets/users/user.jpg') }];

      // Sort the leaderboard data by score in descending order
      const sortedLeaderboardData = updatedLeaderboard.sort((a, b) => b.score - a.score);
      setLeaderboardData(sortedLeaderboardData);
      setLoading(false); // Stop loading indicator
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  // Render each item in the leaderboard
  const renderLeaderboardItem = ({ item }) => (
    <View style={styles.leaderboardItem}>
      <Image source={item.avatar} style={styles.avatar} />
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userScore}>{item.score} Points</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={renderLeaderboardItem}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  userScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default Leaderboard;
