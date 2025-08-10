import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { setupDatabase } from './app/db/database';
import LoadingScreen from './app/components/LoadingScreen';

import HomeScreen from './app/screens/HomeScreen';
import NewEntryScreen from './app/screens/NewEntryScreen';
import SummaryScreen from './app/screens/SummaryScreen';
import EntryDetailScreen from './app/screens/EntryDetailScreen';
import { createStackNavigator } from '@react-navigation/stack';
import UserInfoScreen from './app/screens/UserInfoScreen';
import { DefaultTheme } from 'react-native-paper';
import CBTExercisesScreen from './app/screens/CBTExercisesScreen';
import ThoughtLogScreen from './app/screens/ThoughtLogScreen';
import ThoughtLogEntryScreen from './app/screens/thought-log/ThoughtLogEntryScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          if (route.name === 'Today') {
            iconName = 'calendar-today';
          } else if (route.name === 'Summary') {
            iconName = 'chart-bar';
          } else if (route.name === 'UserInfo') {
            iconName = 'account-circle';
          } else {
            iconName = 'circle';
          }

          return (
            <MaterialCommunityIcons
              name={iconName as any}
              color={color}
              size={size ?? 24}
            />
          );
        },
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.backdrop,
        tabBarStyle: {
          backgroundColor: theme.colors.primaryContainer,
          borderTopWidth: 1,
          borderColor: theme.colors.secondary,
          elevation: 2,
        },
      })}
    >
      <Tab.Screen name="Today" component={HomeScreen} options={{ headerShown: false}} />
      <Tab.Screen name="Summary" component={SummaryScreen} options={{headerStyle: { backgroundColor: theme.colors.primaryContainer }}} />
      <Tab.Screen name="CBTExercises" component={CBTExercisesScreen} options={{ title: 'CBT Exercises', headerStyle: { backgroundColor: theme.colors.primaryContainer } }}/>
      <Tab.Screen name="UserInfo" component={UserInfoScreen} options={{ title: 'User Information', headerStyle: { backgroundColor: theme.colors.primaryContainer } }}/>
    </Tab.Navigator>
  );
}

/*const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#C19BFF',
    secondary: '#CEAFFF',
    tertiary: '#F6B2FF',
    background: '#FFC6FE',
    surface: '#FCD6F7',
    text: '#000000',
    disabled: '#FCD6F7',
    // Add or override other colors as needed
  },
};*/

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4691ED',
    secondary: '#9E4F05',
    tertiary: '#F8963A',
    background: '#FCD5B0',
    surface: '#7DB2F2',
    onSurface: '#FFFAFF',
    disabled: '#FCD6F7',
    secondaryContainer: '#1154A7',
    primaryContainer: '#FAB575',
    // Add or override other colors as needed
  },
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await setupDatabase();
        // Add a small delay to show the loading screen
        setTimeout(() => setIsLoading(false), 1500);
      } catch (error) {
        console.error('Error setting up database:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <PaperProvider theme={theme}>
        <LoadingScreen />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Main Tabs */}
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          {/* Other Screens */}
          <Stack.Screen
            name="entryDetail"
            component={EntryDetailScreen}
            options={{ title: 'Entry Details', headerStyle: {backgroundColor: theme.colors.primaryContainer}}}
          />
          <Stack.Screen
            name="entryForm"
            component={NewEntryScreen}
            options={{ title: 'New Entry', headerStyle: {backgroundColor: theme.colors.primaryContainer} }}
          />
          <Stack.Screen
            name="thoughtRecordsScreen"
            component={ThoughtLogScreen}
            options={{ title: 'Thought Log', headerStyle: {backgroundColor: theme.colors.primaryContainer} }}
          />
          <Stack.Screen
            name="thoughtLogEntry"
            component={ThoughtLogEntryScreen}
            options={{ title: 'Thought Log Entry', headerStyle: {backgroundColor: theme.colors.primaryContainer} }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}