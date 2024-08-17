import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MoodTags = ({ navigation }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const tags = [
    { name: 'Family', emoji: '👨‍👩‍👧' },
    { name: 'Friends', emoji: '👫' },
    { name: 'Love', emoji: '❤️' },
    { name: 'Sports', emoji: '⚽' },
    { name: 'Work', emoji: '💼' },
    { name: 'Study', emoji: '📚' },
    { name: 'Relax', emoji: '😌' },
    { name: 'Travel', emoji: '✈️' },
    { name: 'Food', emoji: '🍔' },
    { name: 'Music', emoji: '🎵' }
  ];

  const toggleTag = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
  };

  const saveTags = async () => {
    try {
      await AsyncStorage.setItem('tags', JSON.stringify(selectedTags));
      navigation.navigate('MoodNote');
    } catch (error) {
      console.log('Error saving tags:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Tags:</Text>
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tagButton, selectedTags.includes(tag.name) && styles.selectedTag]}
            onPress={() => toggleTag(tag.name)}
          >
            <Text style={styles.tagEmoji}>{tag.emoji}</Text>
            <Text style={styles.tagText}>{tag.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveTags}>
        <Text style={styles.saveButtonText}>Save Tags</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  selectedTag: {
    backgroundColor: '#4CAF50',
  },
  tagEmoji: {
    marginRight: 5,
    fontSize: 18,
  },
  tagText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MoodTags;
