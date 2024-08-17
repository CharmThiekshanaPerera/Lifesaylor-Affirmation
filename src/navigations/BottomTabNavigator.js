// BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import MaterialCommunityIcons
import HabitScreen from '../screens/Habit/HabitScreen';
import MoodTracker from '../screens/MoodTracker/MoodTracker';
import JournalAdding from '../screens/Journal/JournalAdding';
import RandomScreen from '../screens/Random/RandomMotivation';
import VisionBoardScreen from '../screens/VisionBoard/VisionBoard';

import JournalHome from '../screens/Journal/JournalHome';
import MyMood from '../screens/MoodTracker/MyMood';
import VisionList from '../screens/VisionBoard/VisionList';
import ViewHabits from '../screens/Habit/ViewHabits';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Habit') {
            iconName = 'format-list-bulleted'; // Icon name for list
          } else if (route.name === 'Mood') {
            iconName = 'emoticon-happy-outline'; // Icon name for happy emoticon
          } else if (route.name === 'Journal') {
            iconName = 'book-outline'; // Icon name for book
          } else if (route.name === 'Affirmation') {
            iconName = 'heart-outline'; // Icon name for heart
          } else if (route.name === 'VisionBoard') {
            iconName = 'eye-outline'; // Icon name for vision board (you can change it)
          } else if (route.name === 'NewScreen') {
            iconName = 'star-outline'; // Icon name for star


          }else if (route.name === 'Mood') {
            iconName = 'emoticon-happy-outline'; // Icon name for MyMood
          }else if (route.name === 'Journal') {
            iconName = 'book-outline'; // Icon name for Journal Home
          }else if (route.name === 'Vision') {
            iconName = 'eye-outline'; // Icon name for VisionList
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50', // Green color
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [{ display: 'flex' }, null],
      })}
    >
      <Tab.Screen name="Affirmation" component={RandomScreen} options={{ headerShown: false }} />
      {/* <Tab.Screen name="Habit" component={HabitScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Mood" component={MoodTracker} options={{ headerShown: false }} />
      <Tab.Screen name="Journal" component={JournalAdding} options={{ headerShown: false }} />
      <Tab.Screen name="VisionBoard" component={VisionBoardScreen} options={{ headerShown: false }} /> */}
      {/* Add your new screen here */}
      <Tab.Screen name="Habit" component={ViewHabits} options={{ headerShown: false }} />
      <Tab.Screen name="Mood" component={MyMood} options={{ headerShown: false }} />
      <Tab.Screen name="Journal" component={JournalHome} options={{ headerShown: false }} />
      <Tab.Screen name="Vision" component={VisionList} options={{ headerShown: false }} />

    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
