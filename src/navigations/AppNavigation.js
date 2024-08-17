import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './RootNavigation';
import React from 'react';
import AffirmationsSlideshow from '../screens/Affirmations/AfirmationsSlideshow';
import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import DrawerContainer from '../screens/DrawerContainer/DrawerContainer';
import HomeScreen from '../screens/Home/HomeScreen';
import IngredientScreen from '../screens/Ingredient/IngredientScreen';
import IngredientsDetailsScreen from '../screens/IngredientsDetails/IngredientsDetailsScreen';
import Motivations from '../screens/Motivations/Motivations';
import Privacy from '../screens/Privacy/Privacy';
import Profile from '../screens/Profile/Profile';
import User from '../screens/Profile/User';
import PageOne from '../screens/Question/PageOne';
import PageTwo from '../screens/Question/PageTwo';
import RandomScreen from '../screens/Random/RandomMotivation';
import RecipeScreen from '../screens/Recipe/RecipeScreen';
import RecipesListScreen from '../screens/RecipesList/RecipesListScreen';
import Reminder from '../screens/Reminder/Reminder';
import SearchScreen from '../screens/Search/SearchScreen';
import Test from '../screens/Test/Test';
import Welcome from '../screens/Welcome/Welcome';
import ReminderList from '../screens/Reminder/ReminderList';
import TestNotifications from '../screens/Reminder/TestNotifications';
import BreathingAnimation from '../screens/Random/BreathingAnimation';
import ScheduledNotificationsScreen from '../screens/Reminder/ScheduledNotificationsScreen';
import TypingAnimation from '../screens/Random/TypingAnimation';
import CategoryChange from '../screens/Type/CategoryChange';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import NewcategoryReminder from '../screens/Type/NewcategoryReminder';
import CustomCategory from '../screens/Type/CustomCategory';
import HabitScreen from '../screens/Habit/HabitScreen';
import PreHabitScreen from '../screens/Habit/PreHabitScreen';
import PreHabitReminder from '../screens/Habit/PreHabitReminder';
import HabitReminder from '../screens/Habit/HabitReminder';
import CreateHabit from '../screens/Habit/CreateHabit';
import CreateReminder from '../screens/Habit/CreateReminder';
import ViewHabits from '../screens/Habit/ViewHabits';
import JournalHome from '../screens/Journal/JournalHome';
import JournalAdding from '../screens/Journal/JournalAdding';
import ColorPalette from '../screens/Journal/ColorPalette';
import DayJournal from '../screens/Journal/DayJournal';
import MoodTracker from  '../screens/MoodTracker/MoodTracker';
import FeelTracker from  '../screens/MoodTracker/FeelTracker';
import MoodTags from  '../screens/MoodTracker/MoodTags';
import MoodNote from  '../screens/MoodTracker/MoodNote';
import MyMood from '../screens/MoodTracker/MyMood';
import MoodAnalytics from '../screens/MoodTracker/MoodAnalytics';
import BottomTabNavigator from './BottomTabNavigator';
import VisionBoardScreen from '../screens/VisionBoard/VisionBoard';
import VisionSectionScreen from '../screens/VisionBoard/VisionSection';
import VisionImageScreen from '../screens/VisionBoard/VisionImage';
import VisionMainScreen from '../screens/VisionBoard/VisionMain';
import VisionList from '../screens/VisionBoard/VisionList';
import VisionSlideshow from '../screens/VisionBoard/VisionSlideshow';
import VisionReminder from '../screens/VisionBoard/VisionReminder';
import BoardReminderList from '../screens/VisionBoard/BoardReminderList';
import Quotes from '../screens/DailyZen/Quotes';
import JournalSlideshow from '../screens/Journal/JournalSlideshow';
import HabitPoints from '../screens/Points/HabitPoints';
import MoodPoints from '../screens/Points/MoodPoints';
import JournalPoints from '../screens/Points/JournalPoints';
import VisionPoints from '../screens/Points/VisionPoints';
import AllPoints from '../screens/Points/AllPoints';
import Leaderboard from '../screens/Points/Leaderboard';
import OnboardingScreen from '../screens/Documentation/InstructionDoc';
import HabitInstruction from '../screens/Documentation/HabitInstruction';
import MoodInstruction from '../screens/Documentation/MoodInstruction';
import JournalInstruction from '../screens/Documentation/JournalInstruction';
import VisionInstruction from '../screens/Documentation/VisionInstruction';
import FullDoc from '../screens/Documentation/FullDoc';
import Dashboard from '../screens/Dashboard/Dashboard';
import MoodNotesTable from '../screens/MoodTracker/MoodNotesTable';
import MoodChart from '../screens/MoodTracker/MoodChart';
import CustomAffirmation from '../screens/CustomAffirmations/CustomAffirmation';
import AffirmationList from '../screens/CustomAffirmations/AffirmationList';
import TitleRecords from '../screens/CustomAffirmations/TitleRecords';
import AddRecord from '../screens/CustomAffirmations/AddRecord';
// impoer CustomAffirmatonSlideshow from '../screens/CustomAffirmations/CustomAffirmatonSlideshow'
import SlideshowScreen from '../screens/CustomAffirmations/CustomAffirmationSlideshow';

 const Stack = createStackNavigator();

function MainNavigator() {
  return(
    <Stack.Navigator
      screenOptions={{
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
            flex: 1,
          }
      }}
    >
      <Stack.Screen name='Welcome' component={Welcome}                              options={{ headerTitleAlign: 'center', headerLeft: null,  headerShown: false }}/>
      <Stack.Screen name='Profile' component={Profile}                              options={{ headerShown: false }}/>
      <Stack.Screen name='Home' component={HomeScreen}                              options={{ headerTitleAlign: 'center', headerLeft: null, }}/>
      <Stack.Screen name='Motivation Gallery' component={CategoriesScreen}           options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name='Recipe' component={RecipeScreen}                          options={{ headerShown: false }}/>
      <Stack.Screen name='RecipesList' component={RecipesListScreen}/>
      <Stack.Screen name='Ingredient' component={IngredientScreen} />
      <Stack.Screen name='Search' component={SearchScreen} />
      <Stack.Screen name='IngredientsDetails' component={IngredientsDetailsScreen}       options={{ headerShown: false }}/>
      <Stack.Screen name='Test' component={Test}                                         options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name='My Motivations' component={Motivations}                        options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name='BottomTabNavigator' component={BottomTabNavigator}             options={{ headerShown: false }}/>
      <Stack.Screen name='Random Motivation' component={BottomTabNavigator}              options={{ headerShown: false }}/>
      <Stack.Screen name='User Info' component={User}                                    options={{headerShown: false}}/>
      <Stack.Screen name='Privacy Policy' component={Privacy}                            options={{headerShown: false}}/>
      <Stack.Screen name='PageOne' component={PageOne}                                   options={{headerShown: false}}/>
      <Stack.Screen name='PageTwo' component={PageTwo}                                   options={{headerShown: false}}/>
      <Stack.Screen name='Reminder' component={Reminder}                                 options={{headerShown: false}}/>
      <Stack.Screen name="Affirmation Slideshow" component={AffirmationsSlideshow}       options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="Custom Reminder" component={ReminderList}                      options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="BreathingAnimation" component={BreathingAnimation} />
      <Stack.Screen name="TypingAnimation" component={TypingAnimation} />
      <Stack.Screen name="Scheduled Notifications" component={ScheduledNotificationsScreen} options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="Test Reminder" component={TestNotifications}                      options={{ headerShown: false }}/>
      <Stack.Screen name="Category Change" component={CategoryChange}                       options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="Settings Screen" component={SettingsScreen}                       options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="Type Reminder" component={NewcategoryReminder} />
      <Stack.Screen name="Custom Category" component={CustomCategory}                    options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="HabitScreen" component={HabitScreen}                                 options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="PreHabit" component={PreHabitScreen}                           options={{ headerShown: false }}/>
      <Stack.Screen name="Habit Reminder" component={HabitReminder}                      options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="PreHabit Reminder" component={PreHabitReminder}                  options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="Create Habit" component={CreateHabit}                          options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="Create Reminder" component={CreateReminder}                    options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="View Habits" component={ViewHabits}                            options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="Journal Home" component={JournalHome}                          options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="Journal Adding" component={JournalAdding}                      options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="ColorPalette" component={ColorPalette}                         options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="DayJournal" component={DayJournal}                             options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="MoodTracker" component={MoodTracker}                           options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="FeelTracker" component={FeelTracker}                           options={{ headerShown: false }}/>
      <Stack.Screen name="MoodTags" component={MoodTags}                                 options={{ headerShown: false }}/>
      <Stack.Screen name="MoodNote" component={MoodNote}                                 options={{ headerShown: false }}/>
      <Stack.Screen name="MyMood" component={MyMood}                                     options={{ headerShown: false }}/>
      <Stack.Screen name="MoodAnalytics" component={MoodAnalytics}                       options={{ headerShown: false }}/>
      <Stack.Screen name="VisionBoard" component={VisionBoardScreen}                     options={{ headerShown: false }}/>
      <Stack.Screen name="VisionSection" component={VisionSectionScreen}                 options={{ headerShown: false }}/>
      <Stack.Screen name="VisionImage" component={VisionImageScreen}                     options={{ headerShown: false }}/>
      <Stack.Screen name="VisionMain" component={VisionMainScreen}                       options={{ headerShown: false }}/>
      <Stack.Screen name="VisionList" component={VisionList}                             options={{ headerShown: false }}/>
      <Stack.Screen name="VisionSlideshow" component={VisionSlideshow}                   options={{ headerShown: false }}/>
      <Stack.Screen name="VisionReminder" component={VisionReminder}                     options={{ headerShown: false }}/>
      <Stack.Screen name="BoardReminderList" component={BoardReminderList}               options={{ headerShown: false }}/>
      <Stack.Screen name="Quotes" component={Quotes}                                     options={{ headerShown: false }}/>
      <Stack.Screen name="JournalSlideshow" component={JournalSlideshow}                 options={{ headerShown: false }}/>
      <Stack.Screen name="HabitPoints" component={HabitPoints}                           options={{ headerShown: false }}/>
      <Stack.Screen name="MoodPoints" component={MoodPoints}                             options={{ headerShown: false }}/>
      <Stack.Screen name="JournalPoints" component={JournalPoints}                       options={{ headerShown: false }}/>
      <Stack.Screen name="VisionPoints" component={VisionPoints}                         options={{ headerShown: false }}/>
      <Stack.Screen name="AllPoints" component={AllPoints}                               options={{ headerShown: false }}/>
      <Stack.Screen name="Leaderboard" component={Leaderboard}                           options={{ headerShown: false }}/>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen}                 options={{ headerShown: false }}/>
      <Stack.Screen name="HabitInstruction" component={HabitInstruction}                 options={{ headerShown: false }}/>
      <Stack.Screen name="MoodInstruction" component={MoodInstruction}                   options={{ headerShown: false }}/>
      <Stack.Screen name="JournalInstruction" component={JournalInstruction}             options={{ headerShown: false }}/>
      <Stack.Screen name="VisionInstruction" component={VisionInstruction}               options={{ headerShown: false }}/>
      <Stack.Screen name="FullDoc" component={FullDoc}                                   options={{ headerShown: false }}/>
      <Stack.Screen name="Dashboard" component={Dashboard}                               options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="Mood Table" component={MoodNotesTable}                         options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="Mood Chart" component={MoodChart}                              options={{ headerTitleAlign: 'center' }}/>
      <Stack.Screen name="Custom Affirmation" component={CustomAffirmation}              />
      <Stack.Screen name="Affirmation List" component={AffirmationList}                  />
      <Stack.Screen name="Title Records" component={TitleRecords}                        />
      <Stack.Screen name="Add Record" component={AddRecord}                              />
      <Stack.Screen name="SlideshowScreen" component={SlideshowScreen}                   options={{ headerShown: false }}/>

    </Stack.Navigator>
  )
} 



 const Drawer = createDrawerNavigator();

function DrawerStack() {
  return(
    <Drawer.Navigator
      drawerPosition='left'
      initialRouteName='Main'
      drawerStyle={{ width: 250 }}
      screenOptions={{headerShown: false}}
      drawerContent={({navigation})=> <DrawerContainer navigation={navigation}/>}
    >
      <Drawer.Screen name='Main' component={MainNavigator} />
    </Drawer.Navigator>
  )
} 


 export default function AppContainer() {
  return(
    <NavigationContainer ref={navigationRef}>
      <DrawerStack/>
    </NavigationContainer>
  )
} 
 

console.disableYellowBox = true;