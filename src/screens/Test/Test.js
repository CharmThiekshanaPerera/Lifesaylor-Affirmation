import React, { useLayoutEffect } from "react";
import { FlatList, Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./styles";
import { moods } from "../../data/dataArrays";
import { getNumberOfMotivations } from "../../data/MockDataAPI";
import MenuImage from "../../components/MenuImage/MenuImage";

export default function CategoriesScreen(props) {
  const { navigation } = props;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: { fontWeight: "bold", textAlign: "center", alignSelf: "center", flex: 1,},
      headerLeft: () => (<MenuImage onPress={() => { navigation.openDrawer(); }}/>),
      headerRight: () => <View />,
    });
  }, []);

  const onPressCategory = (item) => {
    const title = item.name;
    const category = item;
    navigation.navigate("RecipesList", { category, title });
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoriesItemContainer}
      underlayColor="rgba(73,182,77,0.9)"
      onPress={() => onPressCategory(item)}
    >
      <Image style={styles.categoriesPhoto} source={{ uri: item.photo_url }} />
      <Text style={styles.categoriesName}>{item.name}</Text>
      {/* <Text style={styles.categoriesInfo}>{getNumberOfMotivations(item.id)} motivations</Text> */}
    </TouchableOpacity>
  );

  const renderTwoCategoriesInRow = ({ item, index }) => {
    // Check if it's an even index to render two items in a row
    if (index % 2 === 0) {
      const nextItem = moods[index + 1];
      return (
        <View style={styles.rowContainer}>
          <View style={styles.categoriesRow}>
            {renderCategory({ item })}
            {nextItem && renderCategory({ item: nextItem })}
          </View>
        </View>
      );
    } else {
      // Return an empty view for odd indexes to maintain alignment
      return <View style={styles.emptyView}></View>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>MOOD TRACKER</Text>
      <FlatList
        data={moods}
        renderItem={renderTwoCategoriesInRow}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

