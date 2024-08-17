// TypingAnimation.js
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

const TypingAnimation = ({ affirmation, currentTheme }) => {
  const animatedValues = useRef([]); // Ref for storing animated values

  useEffect(() => {
    // Initialize animated values when the affirmation changes
    initializeAnimatedValues();
  }, [affirmation]);

  const initializeAnimatedValues = () => {
    // Clear any existing animated values
    animatedValues.current = [];

    // Initialize animated values for each letter in the affirmation
    for (let i = 0; i < affirmation.length; i++) {
      animatedValues.current[i] = new Animated.Value(0);
    }

    // Start the animation
    animateLetters();
  };

  const animateLetters = () => {
    const animations = animatedValues.current.map((animatedValue, index) =>
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500, // Duration for each letter to appear (in milliseconds)
        delay: index * 100, // Delay each letter's animation (in milliseconds)
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start(); // Start the animations in a staggered manner
  };

  return (
    <Text style={styles.text}>
      {affirmation.split('').map((letter, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.letter,
            {
              color: currentTheme.text,
              opacity: animatedValues.current[index], // Set opacity based on the animated value
            },
          ]}
        >
          {letter}
        </Animated.Text>
      ))}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'System', // Use the system font
    textShadowColor: 'rgba(0, 0, 0, 0.25)', // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset
    textShadowRadius: 4, // Shadow radius
    elevation: 5, // Elevation (for Android)
    marginBottom: '40%',
  },
  letter: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'System', // Use the system font
    // Add any additional styles you want here
  },
});

export default TypingAnimation;