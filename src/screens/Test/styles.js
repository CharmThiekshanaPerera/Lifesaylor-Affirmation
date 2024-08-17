import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  categoriesItemContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  categoriesPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  categoriesName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  emptyView: {
    flex: 1,
  },
});

export default styles;
