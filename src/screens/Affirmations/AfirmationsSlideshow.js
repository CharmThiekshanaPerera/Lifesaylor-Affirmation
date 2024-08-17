import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Card, Searchbar } from 'react-native-paper';
import { categories, affirmations } from '../../data/data';
import BreathingAnimation from '../../screens/Random/BreathingAnimation'; // Import BreathingAnimation component

const CategoriesScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showBreathingAnimation, setShowBreathingAnimation] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const flatListRef = useRef(null);
  const intervalRef = useRef(null);

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
    setModalVisible(true);
  };

  const handleBellIconPress = (categoryId, categoryName) => {
    navigation.navigate('Test Reminder', {
      categoryId: categoryId,
      categoryName: categoryName,
    });
  };

  const handleCustomAffirmationPress = () => {
    navigation.navigate('Custom Affirmation');
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setModalVisible(false);
    setCurrentIndex(0);
    setShowBreathingAnimation(true); // Reset the breathing animation state
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (modalVisible && !showBreathingAnimation && flatListRef.current) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          let nextIndex = prevIndex + 1;
          const affirmationData = affirmations.filter((affirmation) =>
            selectedCategory
              ? categories
                  .find((category) => category.id === selectedCategory)
                  .affirmationIds.includes(affirmation.affirmationId)
              : true
          );
          if (nextIndex >= affirmationData.length) {
            closeModal(); // Close the modal when the end is reached
            return 0; // Reset the index
          } else {
            flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
            return nextIndex;
          }
        });
      }, 3000); // Change slides every 3 seconds
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [modalVisible, showBreathingAnimation, flatListRef.current]);

  const renderCategoryCard = ({ item, index }) => {
    const colors = ["#FFFF"];
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          { backgroundColor: colors[index % colors.length] },
          selectedCategory === item.id && styles.selectedCategoryCard,
        ]}
        onPress={() => handleCategoryPress(item.id)}
      >
        <Image source={{ uri: item.photo_url }} style={styles.categoryImage} />
        <Text style={styles.categoryCardText}>{item.name}</Text>

        <TouchableOpacity
          style={styles.bellIcon}
          onPress={() => handleBellIconPress(item.id, item.name)}
        >
          <FontAwesome name="bell" size={22} color="#4CAF50" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderAffirmationSlide = ({ item, index }) => (
    <View style={styles.slideContainer}>
      <ImageBackground source={{ uri: item.image }} style={styles.popupImage} resizeMode="cover">
        <View style={styles.centerContent}>
          <Text style={styles.popupDescription}>{item.description}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredCategories}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal={false}
        numColumns={2}
        style={styles.flatlist}
      />

      <TouchableOpacity style={styles.customAffirmationButton} onPress={handleCustomAffirmationPress}>
        <Text style={styles.customAffirmationButtonText}>Create Custom Affirmation</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          {showBreathingAnimation ? (
            <View style={styles.breathingContainer}>
              <BreathingAnimation />
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => setShowBreathingAnimation(false)}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={affirmations.filter((affirmation) =>
                selectedCategory
                  ? categories
                      .find((category) => category.id === selectedCategory)
                      .affirmationIds.includes(affirmation.affirmationId)
                  : true
              )}
              renderItem={renderAffirmationSlide}
              keyExtractor={(item) => item.affirmationId.toString()}
              pagingEnabled
              horizontal
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
                setCurrentIndex(index);
              }}
              initialScrollIndex={currentIndex}
            />
          )}
          <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
            <FontAwesome name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    marginVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    alignItems: 'center',
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  selectedCategoryCard: {
    backgroundColor: 'lightblue',
  },
  categoryCardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryImage: {
    width: 130,
    height: 112,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 5,
    borderColor: '#fff'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContainer: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
  },
  centerContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  popupDescription: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  bellIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  flatlist: {
    marginBottom: -20,
  },
  breathingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop:"50%",
    marginRight:'50%'

  },
  skipButton: {
    position: 'absolute',
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    top:"80%",
    left:"37%"
  },
  skipButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  customAffirmationButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    
  },
  customAffirmationButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategoriesScreen;
