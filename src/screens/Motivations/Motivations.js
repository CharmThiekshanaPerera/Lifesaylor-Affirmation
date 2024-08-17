import React, { useLayoutEffect, useEffect, useState } from "react";
import { FlatList, Text, View, Image, TouchableHighlight } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./styles";
import { categories } from "../../data/dataArrays";
import { getNumberOfRecipes } from "../../data/MockDataAPI";
import MenuImage from "../../components/MenuImage/MenuImage";

export default function CategoriesScreen(props) {
  const { navigation } = props;
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Load the user's name from AsyncStorage when the component mounts
    loadUserName();
  }, []);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitleStyle: { fontWeight: "bold", textAlign: "center", alignSelf: "center", flex: 1,},
  //     headerLeft: () => (<MenuImage onPress={() => { navigation.openDrawer(); }}/>),
  //     headerRight: () => <View />,
  //   });
  // }, []);

  const loadUserName = async () => {
    try {
      // Retrieve the user's name from AsyncStorage
      const savedUserName = await AsyncStorage.getItem('userName');

      if (savedUserName !== null) {
        setUserName(savedUserName);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  const onPressCategory = (item) => {
    const title = item.name;
    const category = item;
    navigation.navigate("RecipesList", { category, title });
  };

  const renderCategory = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressCategory(item)}>
      <View style={styles.categoriesItemContainer}>
        <Image style={styles.categoriesPhoto} source={{ uri: item.photo_url }} />
        <Text style={styles.categoriesName}>{item.name}</Text>
        <Text style={styles.categoriesInfo}>{getNumberOfRecipes(item.id)} motivations</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View>
      {/* <Text style={styles.welcomeText}>Welcome {userName}</Text> */}
      <FlatList data={categories} renderItem={renderCategory} keyExtractor={(item) => `${item.id}`} />
    </View>
  );
}
