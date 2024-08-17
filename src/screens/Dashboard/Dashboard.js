import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation();

  const navigateToSection = (sectionName) => {
    navigation.navigate(sectionName);
  };

  const cards = [
    { name: 'Affirmations', image: require('../../../assets/dashboard/a.jpg'), section: 'Affirmation Slideshow' },
    { name: 'Habits', image: require('../../../assets/dashboard/b.jpeg'), section: 'Habit' },
    { name: 'Mood', image: require('../../../assets/dashboard/c.jpeg'), section: 'MoodTracker' },
    { name: 'Journal', image: require('../../../assets/dashboard/d.jpeg'), section: 'Journal Adding' },
    { name: 'Vision', image: require('../../../assets/dashboard/e.jpeg'), section: 'VisionBoard' },
    { name: 'Quotes', image: require('../../../assets/dashboard/f.jpeg'), section: 'Quotes' },
  ];

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <TouchableOpacity key={index} style={styles.card} onPress={() => navigateToSection(card.section)}>
          <ImageBackground source={card.image} style={styles.cardImage}>
            <View style={styles.title}>
              <Text style={styles.cardName}>{card.name}</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    width: '48%', // Adjust as needed
    aspectRatio: 1, // Keep aspect ratio square
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    width: '100%', // Ensure the image takes full width of the card
    height: '100%', // Ensure the image takes full height of the card
  },
  title: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background for text
    padding: 10,
  },
  cardName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Dashboard;
