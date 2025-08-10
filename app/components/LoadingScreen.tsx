import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

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
      <Image 
        source={require('../../assets/my-cherryspace.png')} 
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}
