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
import ThoughtLogViewScreen from './app/screens/thought-log/ThoughtLogViewScreen';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'CircularStd-Book',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'CircularStd-Medium', 
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'CircularStd-Bold',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'CircularStd-Bold',
      fontWeight: '700',
    },
  },
  colors: {
    ...DefaultTheme.colors,
    // New sophisticated color palette from reference
    primary: '#FEAE96',           // Warm coral/peach for primary actions
    secondary: '#FE979C',         // Soft pink for secondary elements  
    tertiary: '#013237',          // Deep navy blue for accents
    
    // Backgrounds and surfaces
    background: '#F6E8DF',        // Warm cream background
    surface: '#FFFFFF',           // Pure white surface for cards
    surfaceVariant: '#F9F1ED',    // Subtle warm variant
    
    // Primary containers - lighter tints
    primaryContainer: '#FEF0EC',  // Very light coral
    secondaryContainer: '#FEF3F4', // Very light pink
    tertiaryContainer: '#E8F0F1',  // Very light navy
    
    // Text colors
    onPrimary: '#FFFFFF',         // White text on primary
    onSecondary: '#FFFFFF',       // White text on secondary
    onTertiary: '#FFFFFF',        // White text on tertiary
    onBackground: '#013237',      // Deep navy for main text
    onSurface: '#013237',         // Deep navy text on surfaces
    onSurfaceVariant: '#5A6B6D',  // Muted navy for secondary text
    
    // Interactive states
    outline: '#FEAE96',           // Primary coral for borders
    outlineVariant: '#E5D5CE',    // Subtle warm borders
    
    // Status colors
    error: '#D93025',             // Standard error red
    onError: '#FFFFFF',           // White text on error
    errorContainer: '#FCE8E6',    // Light error background
    onErrorContainer: '#410E0B',  // Dark text on error container
    
    // Special colors
    shadow: '#000000',            // Black shadow
    scrim: '#000000',             // Black scrim
    inverseSurface: '#013237',    // Deep navy for inverse
    inverseOnSurface: '#FFFFFF',  // White text on inverse
    inversePrimary: '#FDD4C7',    // Light coral for inverse
    
    // Additional semantic colors
    backdrop: '#8A9597',          // Muted navy for disabled text
    disabled: '#D0D7D8',          // Light gray for disabled elements
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Weekly') {
            iconName = 'calendar-week';
          } else if (route.name === 'UserInfo') {
            iconName = 'account-circle';
          } else if (route.name === 'CBTExercises') {
            iconName = 'brain';
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
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false}} />
      <Tab.Screen name="Weekly" component={SummaryScreen} options={{headerStyle: { backgroundColor: theme.colors.primaryContainer }}} />
      <Tab.Screen name="CBTExercises" component={CBTExercisesScreen} options={{ title: 'CBT Exercises', headerStyle: { backgroundColor: theme.colors.primaryContainer } }}/>
      <Tab.Screen name="UserInfo" component={UserInfoScreen} options={{ title: 'User Information', headerStyle: { backgroundColor: theme.colors.primaryContainer } }}/>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Starting database setup...');
        await setupDatabase();
        console.log('Database setup completed');
        
        // Add a small delay to show the loading screen
        setTimeout(() => setIsLoading(false), 1500);
      } catch (error) {
        console.error('Critical error during app initialization:', error);
        // Don't crash the app, just show loading error
        setHasError(true);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Show error state if something went wrong
  if (hasError) {
    return (
      <PaperProvider theme={theme}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
            Something went wrong during app initialization.
          </Text>
          <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
            Please restart the app. If the problem persists, try clearing app data.
          </Text>
        </View>
      </PaperProvider>
    );
  }

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
          <Stack.Screen
            name="thoughtLogView"
            component={ThoughtLogViewScreen}
            options={{ title: 'Thought Log View', headerStyle: {backgroundColor: theme.colors.primaryContainer} }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}