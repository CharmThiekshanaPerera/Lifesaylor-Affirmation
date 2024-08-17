import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Entypo } from '@expo/vector-icons';

const MoodChart = () => {
  const [moodData, setMoodData] = useState([]);
  const [moodPairs, setMoodPairs] = useState([]);
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const moodNotesData = await AsyncStorage.multiGet(keys.filter(key => key.startsWith('moodNote_')));
        const formattedMoodData = moodNotesData.map(([key, value]) => {
          const timestamp = parseInt(key.replace('moodNote_', ''));
          const { moodData } = JSON.parse(value);
          return { timestamp, moodName: moodData.moodName };
        });

        const pairs = formattedMoodData.map(data => ({
          x: formatDate(data.timestamp),
          y: moodToNumber(data.moodName)
        }));
        await AsyncStorage.setItem('moodPairs', JSON.stringify(pairs));

        setMoodData(formattedMoodData);
        setMoodPairs(pairs);
      } catch (error) {
        console.error('Error fetching mood data:', error);
      }
    };
    fetchMoodData();
  }, []);

  const moodToNumber = moodName => {
    switch (moodName.toLowerCase()) {
      case 'happy':
        return 1;
      case 'sad':
        return 2;
      case 'angry':
        return 3;
      case 'excited':
        return 4;
      case 'calm':
        return 5;
      case 'surprised':
        return 6;
      case 'grateful':
        return 7;
      case 'tired':
        return 8;
      case 'stressed':
        return 9;
      case 'confused':
        return 10;
      default:
        return 0;
    }
  };

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const moodLegend = [
    { mood: 'Happy', value: 1 },
    { mood: 'Sad', value: 2 },
    { mood: 'Angry', value: 3 },
    { mood: 'Excited', value: 4 },
    { mood: 'Calm', value: 5 },
    { mood: 'Surprised', value: 6 },
    { mood: 'Grateful', value: 7 },
    { mood: 'Tired', value: 8 },
    { mood: 'Stressed', value: 9 },
    { mood: 'Confused', value: 10 },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.rotateButton} onPress={() => setRotate(!rotate)}>
        <Entypo name="cycle" size={24} color="black" />
        <Text style={styles.rotateText}>{rotate ? 'Rotate Back' : 'Rotate'}</Text>
      </TouchableOpacity>
      {!rotate ? (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mood Analytics Chart</Text>
          <Text style={styles.description}>This chart represents the mood data over time.</Text>
        </View>
      ) : (
        <View style={styles.rotateContainer}>
          <MoodLegend moodLegend={moodLegend} />
          <MoodChartComponent moodPairs={moodPairs} rotate={rotate} />
          <MoodTable moodPairs={moodPairs} />
        </View>
      )}
      {!rotate && moodPairs.length > 0 && (
        <View>
          <MoodLegend moodLegend={moodLegend} />
          <MoodChartComponent moodPairs={moodPairs} rotate={rotate} />
          <MoodTable moodPairs={moodPairs} />
        </View>
      )}
      {moodPairs.length === 0 && (
        <Text style={styles.noDataText}>No mood data available to display</Text>
      )}
    </View>
  );
};

const MoodLegend = ({ moodLegend }) => (
  <View style={styles.legendContainer}>
    <View style={styles.legendList}>
      {moodLegend.map(item => (
        <View key={item.value} style={styles.tag}>
          <Text style={styles.tagText}>{item.mood}</Text>
          <Text style={styles.tagValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  </View>
);

const MoodChartComponent = ({ moodPairs, rotate }) => {
  const labels = moodPairs.map(pair => pair.x);
  const data = moodPairs.map(pair => pair.y);

  return (
    <LineChart
      data={{
        labels: labels,
        datasets: [
          {
            data: data,
          },
        ],
      }}
      width={rotate ? Dimensions.get('window').height - 300 : Dimensions.get('window').width - 40}
      height={rotate ? Dimensions.get('window').width - 40 : 220}
      yAxisLabel=""
      yAxisSuffix=""
      chartConfig={{
        backgroundColor: '#e26a00',
        backgroundGradientFrom: '#4CAF50',
        backgroundGradientTo: '#ffa726',
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: '6',
          strokeWidth: '2',
          stroke: '#ffa726',
        },
      }}
      style={{
        marginVertical: 50,
        borderRadius: 16,
        transform: [{ rotate: rotate ? '90deg' : '0deg' }],
      }}
    />
  );
};

const MoodTable = ({ moodPairs }) => {
  const renderMoodPairItem = ({ item }) => (
    <View style={styles.pairContainer}>
      <Text style={styles.pairText}>{item.x}</Text>
      <Text style={styles.pairText}>{item.y}</Text>
    </View>
  );

  return (
    <View style={styles.tableContainer}>
      {/* Uncomment the following lines to display the mood table */}
      {/* <FlatList
        data={moodPairs}
        renderItem={renderMoodPairItem}
        keyExtractor={(item, index) => index.toString()}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    //justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  rotateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20
  },  
  noDataText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  legendContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  legendList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  tagText: {
    fontSize: 16,
    marginRight: 5,
    color: 'white',
  },
  tagValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  tableContainer: {
    marginBottom: 20,
    width: '100%',
  },
  pairContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  pairText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'center',
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
  rotateText: {
    marginLeft: 5,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  rotate: {
    transform: [{ rotate: '90deg' }],
  },
});

export default MoodChart;
