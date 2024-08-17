import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';

const DayJournal = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      const storedJournals = await AsyncStorage.getItem('gratitudeJournals');
      if (storedJournals !== null) {
        const journals = JSON.parse(storedJournals);
        console.log('Gratitude Journals:', journals);
        setJournalEntries(journals);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const renderJournalEntriesForDate = () => {
    if (!selectedDate) return null;
  
    const selectedDateString = new Date(selectedDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    console.log('Selected Date String:', selectedDateString);
  
    const journalEntry = journalEntries.find(entry => {
      const entryDateString = entry.date;
      console.log('Entry Date String:', entryDateString);
      return entryDateString === selectedDateString;
    });

    if (journalEntry) {
      console.log('Journal Entry:', journalEntry); // Added console log
      return (
        <View style={styles.entryContainer}>
          {/* <Text style={styles.date}>{selectedDateString}</Text> */}
          <Text style={styles.entry}>{journalEntry.entry}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.noEntriesContainer}>
          <Text style={styles.noEntriesText}>No journal entry found for this date.</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Journal Entries</Text>
      <Calendar
        onDayPress={(day) => {
          console.log('Selected Date:', day.dateString);
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#4CAF50' }
        }}
        theme={{
          arrowColor: 'black',
          selectedDayBackgroundColor: '#4CAF50',
          selectedDayTextColor: 'white',
          todayTextColor: '#4CAF50',
          dayTextColor: 'black',
        }}
      />
      <ScrollView style={styles.scrollView}>
        {renderJournalEntriesForDate()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  entryContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight:10
  },
  entry: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginRight:10
  },
  noEntriesContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  noEntriesText: {
    fontSize: 16,
    color: 'red',
  },
});

export default DayJournal;
