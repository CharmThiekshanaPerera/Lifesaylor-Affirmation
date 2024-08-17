import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { affirmations } from '../../data/constants';
import { getRandomItem } from '../../data/utils';
import BreathingAnimation from './BreathingAnimation';
//import TypingAnimation from './TypingAnimation'; // Importing TypingAnimation component
import InstructionDoc from '../Documentation/InstructionDoc'; // Import InstructionDoc component
import DynamicAnimation from './DynamicAnimation'; // Import the new component
import BreathingMusic from './BreathingMusic';

const ThemeContext = React.createContext();

const lightTheme = {
  background: '#fff',
  text: '#000',
  buttonBackground: '#007AFF',
};

const darkTheme = {
  background: '#000',
  text: '#fff',
  buttonBackground: '#333',
};

const images = [
  require('../../../assets/themes/a.jpg'),
  require('../../../assets/themes/b.jpg'),
  require('../../../assets/themes/c.jpg'),
  require('../../../assets/themes/d.jpg'),
  require('../../../assets/themes/e.jpg'), 
  require('../../../assets/themes/f.jpg'),
];

const RandomScreen = ({ navigation }) => {
  const [affirmation, setAffirmation] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Show modal initially
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(false);
  const [userName, setUserName] = useState('');
  const [showPlaceholderModal, setShowPlaceholderModal] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showBreathingAnimation, setShowBreathingAnimation] = useState(true); // State to control the visibility of BreathingAnimation
  const [isFingerprintClicked, setIsFingerprintClicked] = useState(false); // State to track if fingerprint button is clicked
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);


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

  useEffect(() => {
    animatePlaceholder();
  }, []);

    // Check if the user has seen instructions before
    const checkInstructionsSeen = useCallback(async () => {
      try {
        const instructionsSeen = await AsyncStorage.getItem('instructionsSeen');
        if (!instructionsSeen) {
          setShowInstructions(true);
          await AsyncStorage.setItem('instructionsSeen', 'true');
        }
      } catch (error) {
        console.error('Error checking instructions seen:', error);
      }
    }, []);
  
    useEffect(() => {
      checkInstructionsSeen();
    }, [checkInstructionsSeen]);

  const animatePlaceholder = () => {
    Animated.sequence([
      // Animation for "Focus on your heart"
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
  
      // Animation for "Relax and breath continually"
      Animated.delay(1000),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
  
      // Repeat the sequence
      Animated.delay(1000),
    ]).start(() => {
      animatePlaceholder(); // Repeat the sequence
    });
  };

  useEffect(() => {
    getSelectedAvatar();
  }, []);
  
  const getSelectedAvatar = async () => {
    try {
      const avatarUri = await AsyncStorage.getItem('selectedAvatarUri');
      if (avatarUri) {
        setSelectedAvatar({ uri: avatarUri });
      }
    } catch (error) {
      console.error('Error fetching selected avatar:', error);
    }
  };
  
  const handleNavigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const translationAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isAutoPlayEnabled) {
      const intervalId = setInterval(() => {
        getRandomAffirmation();
      }, 15000);

      return () => clearInterval(intervalId);
    }
  }, [isAutoPlayEnabled]);

  const getRandomAffirmation = async () => {
    try {
      const customAffirmations =
        JSON.parse(await AsyncStorage.getItem('customAffirmations')) || [];
      const allAffirmations = [...affirmations, ...customAffirmations];
      const randomAffirmation = getRandomItem(allAffirmations);
  
      setAffirmation(randomAffirmation); // Set the entire affirmation at once
  
      // Optionally, you can reset translationAnim here if needed
      // You can remove the loop for playing one word at a time
      // The entire affirmation will be displayed at once

      // const words = randomAffirmation.split(' ');

      // setAffirmation(words[0]);

      // for (let i = 1; i < words.length; i++) {
      //   await new Promise((resolve) => setTimeout(resolve, 1500)); // Delay increased to 1500 milliseconds

      //   Animated.timing(translationAnim, {
      //     toValue: 0,
      //     duration: 1000,
      //     useNativeDriver: true,
      //   }).start(() => {
      //     setAffirmation((prevAffirmation) => `${prevAffirmation} ${words[i]}`);
      //     translationAnim.setValue(20);
      //   });
      // }
    } catch (error) {
      console.error('Failed to fetch affirmation: ', error);
    }
  };
  

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const toggleMusic = () => {
    setIsMusicPlaying((prev) => !prev);
  };

  const handleRefresh = () => {
    // Slowly appear the affirmation over 3 seconds
    Animated.timing(translationAnim, {
      toValue: 0,
      duration: 3000, // Duration for the entire animation
      useNativeDriver: true,
    }).start(() => {
      // After the animation completes, get a new random affirmation
      getRandomAffirmation();
      // Reset translationAnim value for the next animation
      translationAnim.setValue(20);
    });
  };
  

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start();
  };

  const handleImagePick = (image) => {
    setSelectedImage(image);
    setIsModalVisible(false);
    setShowBreathingAnimation(false); // Ensure BreathingAnimation remains visible
  };

  const renderImageItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleImagePick(item)}>
      <View style={{ borderWidth: 1, borderColor: '#ccc', margin: 5 }}>
        <Image source={item} style={{ width: 100, height: 100 }} />
      </View>
    </TouchableOpacity>
  );

  const toggleAutoPlay = () => {
    handleRefresh();
    setIsAutoPlayEnabled((prevStatus) => !prevStatus);
  };

  const handleNavigateToMotivations = () => {
    navigation.navigate('Dashboard');
  };

  const handleNavigateToQuote = () => {
    navigation.navigate('Quotes');
  };

  const handleNavigateToDoc = () => {
    navigation.navigate('FullDoc');
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const closeModal = () => {
    setShowInstructions(false);
  };

  return (
    <ThemeContext.Provider value={currentTheme}>
      <View
        style={[
          styles.container,
          styles.backgroundImage,
          { backgroundColor: currentTheme.background },
        ]}
      >
        {selectedImage && (
          <Image source={selectedImage} style={styles.backgroundImage} />
        )}

        {/* Top icons */}
        <View style={styles.topIcons}>
        <TouchableOpacity style={styles.profile} onPress={handleNavigateToProfile}>
        {selectedAvatar && (
    <Image source={selectedAvatar} style={styles.avatarImage} />
  )}
    <Text style={styles.userNameText}>Hi {userName}</Text>
  </TouchableOpacity>
  
          <TouchableOpacity onPress={handleNavigateToDoc} style={styles.themeToggle}>
          <Ionicons
            name="document"  // Add the desired icon name here
            size={28}
            color={currentTheme.text}
          />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Icon
              name={isDarkMode ? 'white-balance-sunny' : 'weather-night'}
              size={25}
              color={currentTheme.text}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.themeToggle}>
            <Icon
              name="image"
              size={25}
              color={currentTheme.text}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMusic} style={styles.themeToggle}>
            <Icon
              name={isMusicPlaying ? 'music-note' : 'music-note-off'}
              size={25}
              color={currentTheme.text}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToMotivations} style={styles.themeToggle}>
            <Ionicons
              name="list"
              size={28}
              color={currentTheme.text}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={handleNavigateToQuote} style={styles.themeToggle}>
          <Ionicons
            name="heart"  // Add the desired icon name here
            size={28}
            color={currentTheme.text}
          />
          </TouchableOpacity> */}
          
        </View>

         {/* Breathing music */}
         <BreathingMusic isPlaying={isMusicPlaying} />

          {/* Placeholder modal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={showPlaceholderModal}
          onRequestClose={() => {
            setShowPlaceholderModal(false);
          }}
        >
          <TouchableWithoutFeedback style={styles.newmodalContainer} onPress={() => setShowPlaceholderModal(false)}>
            <View style={styles.modalContainer}>
              <Animated.Text style={[styles.placeholderText, { opacity: fadeAnim }]}>Focus on your heart</Animated.Text>
              <Animated.Text style={[styles.placeholderText, { opacity: fadeAnim }]}>Relax and breath continually</Animated.Text>
              <Text style={styles.skipText}>Tap anywhere to skip</Text>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* <View style={styles.affirmationText}>
          <TypingAnimation
            affirmation={affirmation}
            currentTheme={currentTheme}
            translationAnim={translationAnim}
          />       
        </View> */}

        <View style={styles.affirmationText}>
          <DynamicAnimation
            affirmation={affirmation}
            currentTheme={currentTheme}
            translationAnim={translationAnim}
          />
        </View>

        {showBreathingAnimation && (
          <View style={styles.breathingContainer}>
            <BreathingAnimation />
          </View>
        )}
      </View>

      {/* {!isFingerprintClicked && (
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => {
            handleRefresh();
            startAnimation();
            setIsFingerprintClicked(true); // Set fingerprint clicked
          }}
        >
          <Icon name="play" size={24} color="#ffffff" />
        </TouchableOpacity>
      )} */}

      <TouchableOpacity onPress={toggleAutoPlay} style={styles.refreshButton}>
        <Icon
          name={isAutoPlayEnabled ? 'pause' : 'play'}
          size={25}
          color="#ffffff"
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Select Theme</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Icon name="close" style={styles.modalCloseIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <FlatList
              data={images}
              renderItem={renderImageItem}
              keyExtractor={(item) => item}
              numColumns={3}
              style={styles.flatListContainer}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showInstructions}
        onRequestClose={() => setShowInstructions(false)}
      >
        <InstructionDoc closeModal={closeModal} />
      </Modal>
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 45,
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  themeToggle: {
    marginLeft: 'auto', // Align to the right
    //padding: 10,
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    marginRight:10
  },
  affirmationText: {
    fontSize: 35,
    textAlign: 'center',
    marginHorizontal: 20,
    fontWeight: 'bold',
    marginBottom: '30%'
  },
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 50,
    padding: 15,
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
  },
  musicControlButton: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
  },
  musicControlButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  newmodalContainer:{
    backgroundColor: 'green',
    borderWidth: 5,
    borderColor: 'green',
    margin: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseIcon: {
    fontSize: 24,
    color: 'blue',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    marginTop: 20,
  },
  placeholderText: {
    //fontStyle: 'italic',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center', // Center the text
    color: '#555', // Adjust the color as needed
    //marginBottom: '10%', // Add some bottom margin for spacing
  },
  skipText: {
    textAlign: 'center',
    color: '#777',
    marginTop: '10%',
    marginBottom:'100%'
  },
  autoPlayButton: {
    borderRadius: 50,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#ccc',
    margin: 8
  },
  accountIcon: {
    color: 'green',
    marginRight: 5,
  },
  userNameText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'green',
  },
  profile: {
    flexDirection: 'row',
    right: 10,
  },
  breathingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '25%',
    marginBottom:'10%',
    //marginTop:'-5%',
  },
});

export default RandomScreen;