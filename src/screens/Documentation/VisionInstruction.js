import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const OnboardingScreen = ({ navigation, closeModal }) => {
  const [step, setStep] = useState(0); // Current step of the onboarding process
  const onboardingData = [
    {
      image: require('../../../assets/Doc/20.png'),
      name: 'Step 1',
      description: 'Welcome to Vision Board! This is the first step of the vision board  process. Select or enter vision board name',
    },
    {
      image: require('../../../assets/Doc/21.png'),
      name: 'Step 2',
      description: 'Here you can see the second step. You can add vision section name here',
    },
    {
      image: require('../../../assets/Doc/22.png'),
      name: 'Step 3',
      description: 'This is the third step of the vision board  process. You can add description and images according to your vision ',
    },
    {
        image: require('../../../assets/Doc/23.png'),
        name: 'Step 4',
        description: 'This is the fifth step of the vision board process. This is a preview of your submitted data ',
    },
    {
        image: require('../../../assets/Doc/24.png'),
        name: 'Step 5',
        description: 'This is the sixth step of the vision board process. In here you can add reminders, can play it and delete it ',
    },
    {
        image: require('../../../assets/Doc/25.png'),
        name: 'Step 6',
        description: 'This is the final step of the vision board process. In this step you can add date and time to schedule reminders ',
    },
  ];

  const onNext = () => {
    if (step < onboardingData.length - 1) {
      setStep(step + 1);
    } else {
      // If on the last step, close the modal
      closeModal();
    }
  };

  const onSkip = () => {
    // Navigate to the welcome screen if the user chooses to skip the onboarding
    closeModal();
  };

  return (
    <View style={styles.container}>
     <View style={styles.header}>
        <Text style={styles.name}>{onboardingData[step].name}</Text>
      </View>
     <View style={styles.card}>
        <Image source={onboardingData[step].image} style={styles.image} />
      </View>
      <View style={styles.card}>
        <Text style={styles.description}>{onboardingData[step].description}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.buttonTextSkip}> Skip  </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={styles.nextButton}>
          <Text style={[styles.buttonTextNext, { marginRight: 5 }]}>Next</Text>
          <Image source={require('../../../assets/icons/forArrow.png')} style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Set your preferred background color
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ccc',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 10,
    alignSelf: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  skipButton: {
    //backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
  },
  buttonTextSkip: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 20,
    marginBottom:4
  },
  buttonTextNext: {
    fontWeight: 'bold',
    color: '#4CAF50',
    fontSize: 20,
    marginBottom:4
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
});
export default OnboardingScreen;