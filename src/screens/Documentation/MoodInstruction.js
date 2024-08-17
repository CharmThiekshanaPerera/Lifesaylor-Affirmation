import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const OnboardingScreen = ({ navigation, closeModal }) => {
  const [step, setStep] = useState(0); // Current step of the onboarding process
  const onboardingData = [
    {
      image: require('../../../assets/Doc/9.png'),
      name: 'Step 1',
      description: 'Welcome to Mood Tracker! This is the first step of the your mood indentify process. You can select our current mood',
    },
    {
      image: require('../../../assets/Doc/10.png'),
      name: 'Step 2',
      description: 'Here you can see the second step of mood tracker. In here you can select the currnt feeling',
    },
    {
        image: require('../../../assets/Doc/11.png'),
        name: 'Step 3',
        description: 'This is the third step of the tag selection process. You can select more tags here',
    },
    {
      image: require('../../../assets/Doc/12.png'),
      name: 'Step 4',
      description: 'This is the forth step of the mood tracking process. you can add any extra notes here ',
    },
    {
        image: require('../../../assets/Doc/13.png'),
        name: 'Step 4',
        description: 'This is the fifth step of the mood tracking process. you can see what you submit here ',
    },
    {
        image: require('../../../assets/Doc/14.png'),
        name: 'Step 4',
        description: 'This is the final step of the mood tracking process. you can see your mood changing chart here ',
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
