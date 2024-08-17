//VisionList.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Modal, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';

const VisionList = () => {
  const [visionList, setVisionList] = useState([]);
  const [selectedVision, setSelectedVision] = useState(null);
  const [showAddButton, setShowAddButton] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadVisionList = async () => {
      try {
        const savedVisionList = await AsyncStorage.getItem('visionList');
        if (savedVisionList) {
          setVisionList(JSON.parse(savedVisionList));
        }
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error('Error loading vision list:', error);
      }
    };

    loadVisionList();
  }, []);

  const handleDelete = (index) => {
    Alert.alert(
      'Delete Vision',
      'Are you sure you want to delete this vision?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedList = [...visionList];
            updatedList.splice(index, 1);
            setVisionList(updatedList);
            AsyncStorage.setItem('visionList', JSON.stringify(updatedList));
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleReminder = (vision) => {
    navigation.navigate('VisionReminder', {
      visionBoardName: vision.visionBoardName,
      visionSectionName: vision.visionSectionName,
      description: vision.visionData.description,
      images: vision.visionData.images,
    });
    console.log('Reminder for:', vision);
  };

  // const handlePlaySlideshow = (index) => {
  //   setSelectedVision(visionList[index]);
  // };

  const handleModalClose = () => {
    setSelectedVision(null);
  };

  const handlePlaySlideshow = (vision) => {
    // Navigate to VisionSlideshow page and pass vision details
    navigation.navigate('VisionSlideshow', {
      visionBoardName: vision.visionBoardName,
      visionSectionName: vision.visionSectionName,
      description: vision.visionData.description,
      images: vision.visionData.images,
    });
  };

  const renderModalContent = () => {
    if (!selectedVision) return null;

    return (
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>{selectedVision.visionBoardName} With </Text>
          <Text style={styles.modalSubHeader}>{selectedVision.visionSectionName}</Text>
          <Text style={styles.modalDescription}>{selectedVision.visionData.description}</Text>
          <ScrollView horizontal style={styles.modalImageContainer}>
            {selectedVision.visionData.images.map((image, i) => (
              <Image key={i} source={{ uri: image }} style={styles.modalImage} />
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
            <FontAwesome name="times" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.visionItem}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{item.visionBoardName} With </Text>
        <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handlePlaySlideshow(item)}>
            <FontAwesome name="play" size={24} color="#4CAF50" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReminder(item)}>
            <FontAwesome name="bell" size={24} color="#4CAF50" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(index)}>
            <FontAwesome name="trash" size={24} color="#4CAF50" style={styles.icon} />
          </TouchableOpacity>

        </View>
      </View>
      <Text style={styles.subHeader}>{item.visionSectionName}</Text>
      
      <View style={styles.imageContainer}>
        {item.visionData.images.map((image, i) => (
          <Image key={i} source={{ uri: image }} style={styles.image} />
        ))}
        <Text style={styles.description}>{item.visionData.description}</Text>
      </View>
    </View>
  );

  const handleAddButtonPress = () => {
    navigation.navigate('VisionBoard');
  };
  const renderEmptyComponent = () => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image
          source={require('../../../assets/users/a.png')}
          style={styles.image}
        />
        <Text style={styles.descriptions}>
          Start your gratitude journey today by adding your first vision entry!
        </Text>
        {showAddButton && (
          <TouchableOpacity style={styles.button} onPress={handleAddButtonPress}>
            <Text style={styles.buttonText}>Add Vision</Text>
            <Icon name="arrow-right" size={20} color="#fff" style={styles.arrowIcon} />
          </TouchableOpacity>
        )}
      </Card.Content>
    </Card>
  );
  

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : visionList.length === 0 ? (
        renderEmptyComponent()
      ) : (
        <View style={styles.content}>
          <FlatList
            data={visionList}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.list}
          />
          
        </View>
      )}
      <Modal
        visible={!!selectedVision}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        {renderModalContent()}
      </Modal>
      {visionList.length > 0 && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
              <MaterialIcons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginVertical: 30,
  },
  visionItem: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 15,
    color: '#777',
  },
  descriptions: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: Dimensions.get('window').width / 3 - 20,
    height: Dimensions.get('window').width / 3 - 20,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  modalDescription: {
    marginBottom: 10,
    color: '#777',
  },
  modalImageContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  modalImage: {
    width: 70,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  card: {
    marginVertical: '50%',
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  cardContent: {
    alignItems: 'center',
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 200, // Adjust width as needed
    height: 200, // Adjust height as needed
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'grey',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  description: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
});

export default VisionList;
