import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text as RNText,
  ImageBackground,
} from 'react-native';
import { Card, Icon, Text } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { subCategories, categories } from '../../data/mapping';

const SubCategoryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadSelectedCategory = async () => {
      try {
        const selectedCategory = (await AsyncStorage.getItem('selectedCategory'))?.trim();
        console.log('Selected Category:', selectedCategory);

        if (selectedCategory) {
          const selectedCategoryData = categories.find(
            (category) => category.name.trim().toLowerCase() === selectedCategory.toLowerCase()
          );

          if (selectedCategoryData) {
            const filteredSubCategories = subCategories.filter((subCategory) =>
              selectedCategoryData.subCategoryIds.includes(subCategory.subCategoryId)
            );

            setSelectedSubCategories(filteredSubCategories);
          }
        }
      } catch (error) {
        console.error('Error loading selected category:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSelectedCategory();
  }, []);

  const handleContinuePress = () => {
    navigation.navigate('Reminder');
  };

  return (
    <ImageBackground
      source={require("../../../assets/background/a.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.cardContainer}>
            <Text style={styles.headerText}>
              Great! Just 5 minutes of daily affirmations will help you be yourself.
            </Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                {selectedSubCategories.map((subCategory) => (
                  <Card key={subCategory.subCategoryId} containerStyle={styles.card}>
                    <View style={styles.cardContent}>
                      <Icon
                        name='check-circle'
                        type='font-awesome'
                        color='#4CAF50'
                        size={20}
                        containerStyle={styles.icon}
                      />
                      <Text style={styles.title}>{subCategory.title}</Text>
                    </View>
                  </Card>
                ))}
              </>
            )}
          </View>
        </ScrollView>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinuePress}>
            <RNText style={styles.continueButtonText}>Continue</RNText>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    marginBottom: 10,
    marginTop:'10%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'green',
  },
  cardContainer: {
    marginBottom: 20,
    marginTop:'10%',
  },
  card: {
    borderRadius: 10,
    borderWidth:2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    //color: '#4CAF50',
    //fontWeight: 'bold',
  },

  buttonView: {
    padding: 20,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubCategoryScreen;
