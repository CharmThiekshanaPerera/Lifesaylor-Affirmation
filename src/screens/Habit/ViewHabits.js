import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Switch, Text, TouchableOpacity, View, Image } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const ScheduledHabitScreen = () => {
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  const [notificationToggles, setNotificationToggles] = useState({});
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedNotification, setSelectedNotification] = useState(null); 
  const navigation = useNavigation();

  useEffect(() => {
    const fetchScheduledNotifications = async () => {
      try {
        const allScheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

        if (allScheduledNotifications) {
          setScheduledNotifications(allScheduledNotifications);
          const toggleStates = {};
          allScheduledNotifications.forEach((notification) => {
            toggleStates[notification.identifier] = true;
          });
          setNotificationToggles(toggleStates);
          console.log('All Scheduled Notifications:', allScheduledNotifications);
        } else {
          console.log('No scheduled notifications found.');
        }
      } catch (error) {
        console.error('Error fetching scheduled notifications:', error);
      }
    };

    fetchScheduledNotifications();
  }, []);

  const toggleNotification = async (identifier, toggleState) => {
    try {
      if (toggleState) {
        const notification = scheduledNotifications.find(
          (notification) => notification.identifier === identifier
        );
        await Notifications.scheduleNotificationAsync({
          ...notification,
          trigger: null,
        });
      } else {
        await Notifications.cancelScheduledNotificationAsync(identifier);
      }

      setNotificationToggles((prevToggles) => ({
        ...prevToggles,
        [identifier]: toggleState,
      }));
    } catch (error) {
      console.error('Error toggling scheduled notification:', error);
    }
  };

  const deleteNotification = async (identifier) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      const updatedNotifications = scheduledNotifications.filter(
        (notification) => notification.identifier !== identifier
      );
      setScheduledNotifications(updatedNotifications);
      setModalVisible(false); // Close modal after deletion
    } catch (error) {
      console.error('Error deleting scheduled notification:', error);
    }
  };

  const renderItem = ({ item }) => {
    if (item.content.title === "Habit Reminder") {
      return (
        <View style={styles.notificationItem}>
          <View style={styles.timeContainer}>
            <View style={styles.notificationSubTitle}>
              <MaterialIcons name="event" size={25} color="#4CAF50" />
              <Text style={styles.notificationTitle}>{item.content.body}</Text>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <View style={styles.notificationTrigger}>
              <MaterialIcons name="access-time" size={25} color="#4CAF50" />
              <Text style={styles.notificationTriggerText}>{format(new Date().setHours(item.trigger.hour, item.trigger.minute), 'hh:mm a')}</Text>
            </View>
            <Switch
              value={notificationToggles[item.identifier]}
              onValueChange={(value) => toggleNotification(item.identifier, value)}
              trackColor={{ false: 'grey', true: '#4CAF50' }}
              thumbColor={'white'}
            />
            <TouchableOpacity onPress={() => {
              setSelectedNotification(item);
              setModalVisible(true);
            }}>
              <MaterialIcons style={styles.icon} name="more-vert" size={25} color="#4CAF50"/>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  const renderEmptyComponent = () => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image
          source={require('../../../assets/users/a.png')}
          style={styles.image}
        />
        <Text style={styles.description}>
          Start your gratitude journey today by adding your first Habit entry!
        </Text>
        {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PreHabit')}>
          <Text style={styles.buttonText}>Add Habit</Text>
          <Icon name="arrow-right" size={20} color="#fff" style={styles.arrowIcon} />
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HabitScreen')}>
          <Text style={styles.buttonText}>Add Habit</Text>
          <Icon name="arrow-right" size={20} color="#fff" style={styles.arrowIcon} />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {scheduledNotifications.filter(item => item.content.title === "Habit Reminder").length === 0 ? (
        renderEmptyComponent()
      ) : (
        <FlatList
          data={scheduledNotifications}
          keyExtractor={(item) => item.identifier.toString()}
          renderItem={renderItem}
        />
      )}

      {/* {scheduledNotifications.filter(item => item.content.title === "Habit Reminder").length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('PreHabit')}
        >
          <MaterialIcons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      )} */}

      {scheduledNotifications.filter(item => item.content.title === "Habit Reminder").length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('HabitScreen')}
        >
          <MaterialIcons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.row}
              onPress={() => {
                deleteNotification(selectedNotification.identifier);
              }}
            >
              <Text style={styles.modalText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginVertical: 30,
  },
  notificationItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    marginTop:15
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft:10
  },
  notificationSubTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTrigger: {
    flex: 1,
    fontSize: 18,
    marginRight: 8,
    flexDirection: 'row',
  },
  notificationTriggerText: {
    flex: 1,
    fontSize: 18,
    marginRight: 8,
    flexDirection: 'row',
    marginLeft:10
  },
  icon: {
    marginLeft: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  addButtonIcon: {
    color: '#FFFFFF',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  row :{
    flexDirection: 'row',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
    color: 'gray',
  },
  card: {
    marginVertical: '50%',
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  cardContent: {
    alignItems: 'center',
  },
  description: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

export default ScheduledHabitScreen;
