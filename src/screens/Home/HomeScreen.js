import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  const loadUserName = useCallback(async () => {
    try {
      const savedUserName = await AsyncStorage.getItem('userName');
      if (savedUserName !== null) {
        setUserName(savedUserName);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reload the user's name when the component is focused
      loadUserName();
    });

    return unsubscribe;
  }, [navigation, loadUserName]);

  const handleNavigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const handleNavigateToCategories = () => {
    navigation.navigate('My Motivations');
  };
  const handleNavigateToMotivations = () => {
    navigation.navigate('Motivation Gallery');
  };
  const handleNavigateToTest = () => {
    navigation.navigate('Affirmation Slideshow');
  };
  const handleNavigateToSample = () => {
    navigation.navigate('Random Motivation');
  };

  const onPressCategory = (item) => {
    const title = item.name;
    const category = item;
    navigation.navigate('RecipesList', { category, title });
  };

  const renderCategory = ({ item }) => (
    <TouchableHighlight
      underlayColor="rgba(73,182,77,0.9)"
      onPress={() => onPressCategory(item)}
    >
      <View style={styles.categoriesItemContainer}>
        <Image style={styles.categoriesPhoto} source={{ uri: item.photo_url }} />
        <Text style={styles.categoriesName}>{item.name}</Text>
        <Text style={styles.categoriesInfo}>{getNumberOfRecipes(item.id)} motivations</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <ImageBackground
      source={require('../../../assets/background/f.jpeg')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.welcomeRow}>
          <TouchableOpacity onPress={handleNavigateToProfile}>
            <Text style={styles.welcomeText}>Welcome {userName}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#45B649' }]}
            onPress={handleNavigateToTest}
          >
            <Image
              style={styles.photo}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/9746/9746205.png',
              }}
            />
            <Text style={styles.cardText}>Slide Show</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#4F95EF' }]}
            onPress={handleNavigateToSample}
          >
            <Image
              style={styles.photo}
              source={{
                uri: 'https://ulfire.com.au/wp-content/uploads/2017/01/Motivation-300x300.jpg',
              }}
            />
            <Text style={styles.cardText}>Random Affirmation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#FFB166' }]}
            onPress={handleNavigateToCategories}
          >
            <Image
              style={styles.photo}
              source={{
                uri: 'https://cdn.dribbble.com/users/648289/screenshots/6500093/like_button.png?resize=400x0',
              }}
            />
            <Text style={styles.cardText}>My Affirmation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#FF6B6B' }]}
            onPress={handleNavigateToMotivations}
          >
            <Image
              style={styles.photo}
              source={require('../../../assets/icons/list.png')}
            />
            <Text style={styles.cardText}>Affirmation Gallery</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  welcomeRow: {
    //alignItems: 'flex-end',
    marginTop:8,
    marginBottom: 90,
    justifyContent: 'center',
    alignItems: 'center',

  },
  welcomeText: {
    fontSize: 25,
    color: '#FFF',
    fontWeight: 'bold',
    color: 'green',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  card: {
    width: '45%',
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  photo: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  cardText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  categoriesItemContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: 'center',
  },
  categoriesPhoto: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  categoriesName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoriesInfo: {
    fontSize: 14,
    color: '#777',
  },
});

export default HomeScreen;
