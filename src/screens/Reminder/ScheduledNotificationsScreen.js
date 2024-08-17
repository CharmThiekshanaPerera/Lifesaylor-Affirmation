import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { FAB } from 'react-native-paper';

const ScheduledNotificationsScreen = () => {
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  const [notificationToggles, setNotificationToggles] = useState({});
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [selectedNotification, setSelectedNotification] = useState(null); // State for selected notification
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
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
      } finally {
        setIsLoading(false);
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

  const navigateToCustomReminder = () => {
    navigation.navigate('Custom Reminder');
  };

  const renderItem = ({ item }) => {
    if (item.content.title !== 'Habit Reminder') {
      return (
        <View style={styles.notificationItem}>
          <View style={styles.titleContainer}>
            <Text style={styles.notificationTrigger}>
              Time: {format(new Date().setHours(item.trigger.hour, item.trigger.minute), 'hh:mm a')}
            </Text>
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
          <View style={styles.timeContainer}>
            <Text style={styles.notificationTitle}>{item.content.title}</Text>
            {/* <Text style={styles.notificationTitle}>{item.content.body}</Text> */}
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
      ) : scheduledNotifications.length === 0 ? (
        <Text style={styles.emptyMessage}>No scheduled notifications found.</Text>
      ) : (
        <FlatList
          data={scheduledNotifications}
          keyExtractor={(item) => item.identifier.toString()}
          renderItem={renderItem}
        />
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
      {/* <FAB
        style={styles.fab}
        icon="plus"
        onPress={navigateToCustomReminder}
        color="white"
        animated={true}
      /> */}
      <TouchableOpacity style={styles.addButton} onPress={navigateToCustomReminder}>
      <MaterialIcons name="add" size={30} color="#FFFFFF" />
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  notificationItem: {
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginLeft: 20,
    marginTop: 20,
    marginBottom:10,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flex: 1,
    marginLeft: 10,
  },
  notificationTrigger: {
    textAlign: 'left',
    marginRight: '30%',
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold',
  },
  notificationTitle: {
    textAlign: 'left',
    fontSize: 15,
    color: '#333333',
  },
  icon: {
    marginRight: 10,
  },
  deleteIcon: {
    marginLeft: 'auto',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#999999',
    marginTop: 20,
  },
});

export default ScheduledNotificationsScreen;
