// CategoryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../../data/mapping';
import { useNavigation } from '@react-navigation/native';

const CategoryScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        if (storedUserName) {
          setUserName(storedUserName);
        }
      } catch (error) {
        console.error('Error fetching userName:', error);
      }
    };

    fetchUserName();
  }, []);

  const handleCategorySelection = async (selectedCategory) => {
    setLoading(true);

    try {
      await AsyncStorage.setItem('selectedCategory', selectedCategory);
    } catch (error) {
      console.error('Error saving selected category:', error);
    }

    setLoading(false);
    navigation.navigate('Profile');
  };

  return (
    <ImageBackground
      source={require("../../../assets/background/b.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleCategorySelection(category.name)}
            style={styles.categoryButton}
          >
            <Text style={styles.categoryButtonText}>{category.name}</Text>
          </TouchableOpacity>
        ))}

        {loading && (
          <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'green',
  },
  categoryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 5,
    width: '100%',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
});

export default CategoryScreen;
