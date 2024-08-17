import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Audio } from 'expo-av';

const BreathingMusic = ({ isPlaying }) => {
  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../../assets/music/breathing_music.mp3') // Adjusted import path
        );
        setSound(sound);
        await sound.setIsLoopingAsync(true);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const manageSound = async () => {
      if (sound) {
        if (isPlaying) {
          try {
            await sound.playAsync();
          } catch (error) {
            setError(error);
          }
        } else {
          try {
            await sound.stopAsync();
          } catch (error) {
            setError(error);
          }
        }
      }
    };

    manageSound();
  }, [isPlaying, sound]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return null;
};

export default BreathingMusic;
