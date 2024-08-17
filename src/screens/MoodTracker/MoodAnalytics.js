import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Entypo } from '@expo/vector-icons';

const MoodAnalytics = ({ route }) => {
  const { moodNotes } = route.params;
  const [rotate, setRotate] = useState(false);

  // Extracting dateTime and moodName from moodNotes
  const chartData = moodNotes.map((moodNote) => ({
    x: new Date(moodNote.moodData.dateTime).toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '').replace(':', '.'), // X-axis as dateTime in 'MM/DD/YY HH.MM' format
    y: moodNote.moodData.moodName, // Y-axis as moodName
  }));

  // Get unique mood names for Y-axis labels from the chart data
  const uniqueMoodNames = Array.from(new Set(chartData.map((data) => data.y)));

  return (
    <View style={styles.container}>
      <View style={[styles.titleContainer, rotate && styles.rotate]}>
        <Text style={styles.title}>Mood Analytics Chart</Text>
        <Text style={styles.description}>This chart represents the mood data over time.</Text>
      </View>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: chartData.map((data) => data.x),
            datasets: [
              {
                data: chartData.map((data) => uniqueMoodNames.indexOf(data.y)), // Convert mood names to indexes
              },
            ],
          }}
          width={rotate ? Dimensions.get('window').height - 100 : Dimensions.get('window').width - 100} // from react-native
          height={rotate ? Dimensions.get('window').width - 200 : 220}
          yAxisLabel=""
          xAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: '#f9f9f9',
            backgroundGradientFrom: '#f9f9f9',
            backgroundGradientTo: '#f9f9f9',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            transform: [{ rotate: rotate ? '90deg' : '0deg' }],
          }}
          formatYLabel={(value) => uniqueMoodNames[value]} // Display mood names instead of numbers on Y-axis
        />
      </View>
      <TouchableOpacity onPress={() => setRotate(!rotate)} style={styles.rotateButton}>
        <Entypo name={rotate ? 'cycle' : 'cycle'} size={24} color="black" />
        <Text style={styles.rotateText}>{rotate ? 'Rotate Back' : 'Rotate'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  rotate: {
    transform: [{ rotate: '90deg' }],
  },
  rotateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    position: 'absolute',
    bottom: 20,
  },
  rotateText: {
    marginLeft: 5,
  },
});

export default MoodAnalytics;
