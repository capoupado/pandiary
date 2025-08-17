import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';

export default function LoadingScreen() {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    image: {
      width: 128,
      height: 128,
      marginBottom: 24,
    },
    loadingText: {
      fontSize: 18,
      color: theme.colors.onSurface,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={{ color: theme.colors.backdrop, fontWeight: 'bold' }}>Welcome to Pandiary!</Text>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Your personal mood journal</Text>
      <Avatar.Image size={128} source={require('../../assets/my-cherryspace.png')} style={{ backgroundColor: "rgba(255,255,255,0)" }} />
    </View>
  );
}
