import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    padding: 10,
    width: '100%',
    position: 'absolute',
    top: 30,
    marginHorizontal:20,
    borderRadius: 50,
    alignSelf: 'center',
    borderColor: '#ccc',
  },
  themeToggle: {
    marginLeft: 'auto',
    marginRight: "auto",
  },
  autoPlayButton: {
    borderRadius: 50,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#ccc',
    marginLeft: 'auto',
    marginRight: "auto",
    bottom:3
  },
  affirmationText: {
    fontSize: 35,
    textAlign: 'center',
    marginHorizontal: 20,
    fontWeight: 'bold',
    marginBottom: '40%'
  },
  refreshButton: {
    position: 'absolute',
    bottom: '5%',
    borderRadius: 50,
    padding: 10,
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseIcon: {
    fontSize: 24,
    color: 'blue',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    marginTop: 20,
  },
  placeholderText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#555',
  },
  skipText: {
    textAlign: 'center',
    color: '#777',
    marginTop: '10%',
    marginBottom:'100%'
  },
  accountIcon: {
    color: 'green',
    marginRight: 5,
  },
  userNameText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'green',
  },
  profile: {
    flexDirection: 'row',
    right: 10,
  },
  breathingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '25%',
    marginBottom:'10%',
  },
  instructionsText: {
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  modalContainers: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    top:35
    
  },
  tutorialModals: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorialTexts: {
    fontSize: 18,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'yellow',
    fontWeight: 'bold',
  },
  skipTexts: {
    fontSize: 16,
    color: 'green',
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default styles;
