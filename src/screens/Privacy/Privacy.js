import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicyScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();

  const handleContinue = () => {
    if (isChecked) {
      navigation.navigate('User Info');
    } else {
      alert('Please accept the privacy policy to continue');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.cardContainer}>
        <Card.Title style={styles.cardTitle}>Privacy Policy</Card.Title>
        <Card.Divider />
        <Text style={styles.policyText}>
          <Text style={styles.policyPoint}>1. Collection of Information:</Text> We only collect your username when you use the LifeSaylor Affirmation App.
          {'\n\n'}
          <Text style={styles.policyPoint}>2. Use of Your Username:</Text> Your username is used solely to personalize the affirmations provided by the app.
          {'\n\n'}
          <Text style={styles.policyPoint}>3. Data Sharing:</Text> We do not share your username with any third parties.
          {'\n\n'}
          <Text style={styles.policyPoint}>4. Security Measures:</Text> We implement reasonable security measures to protect your username from unauthorized access.
          {'\n\n'}
          <Text style={styles.policyPoint}>5. Changes to the Privacy Policy:</Text> We may update this Privacy Policy, and any changes will be communicated to you.
        </Text>
        <CheckBox
          title='I accept the Privacy Policy'
          checked={isChecked}
          onPress={() => setIsChecked(!isChecked)}
          containerStyle={styles.checkboxContainer}
        />

<TouchableOpacity style={styles.startButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      </Card>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: '10%'
  },
  cardContainer: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  policyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  policyPoint: {
    fontWeight: 'bold',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginTop: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PrivacyPolicyScreen;
