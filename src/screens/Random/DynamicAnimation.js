import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

const DynamicAnimation = ({ affirmation, currentTheme }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
  }, [affirmation]);

  const startAnimation = () => {
    Animated.sequence([
      // Animation for appearing
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }),
      // Delay for 3 seconds
      Animated.delay(3000),
      // Animation for disappearing
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={{ opacity: animatedValue }}>
      <Text style={[styles.text, { color: currentTheme.text }]}>{affirmation}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    elevation: 5,
    marginBottom: '40%',
  },
});

export default DynamicAnimation;
