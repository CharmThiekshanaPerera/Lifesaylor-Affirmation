import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "#fff",
  },
  photo: {
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: "cover",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  category: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default styles;
