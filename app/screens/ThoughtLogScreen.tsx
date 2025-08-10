import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThoughtLogHelpScreen from './thought-log/ThoughtLogHelpScreen';
import ThoughtLogSummary from './thought-log/ThoughtLogSummary';

const Tab = createBottomTabNavigator();

type Navigation = StackNavigationProp<any>;

export default function ThoughtLogScreen() {
  const navigation = useNavigation<Navigation>();
  const theme = useTheme();

  useEffect(() => {

  }, []);

  useFocusEffect(
    useCallback(() => {

    }, [])
  );

  const styles = StyleSheet.create({

  });

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
      <Tab.Screen name="Your Entries" component={ThoughtLogSummary} options={{ headerShown: false }} />
      <Tab.Screen name="Help" component={ThoughtLogHelpScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

