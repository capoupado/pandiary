import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

type Navigation = StackNavigationProp<any>;

export default function CBTExercisesScreen() {
    const navigation = useNavigation<Navigation>();
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: { flex: 1, padding: 16, backgroundColor: theme.colors.background },
        card: { marginVertical: 8, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 1, borderRadius: 12 },
        tags: { marginTop: 4, fontStyle: 'italic' },
        pressable: { borderRadius: 0 }, // Default style for Pressable
        pressed: { opacity: 0.9 }, // Style applied when Pressable is pressed
    });

    return (
        <View style={styles.container}>
            <Text variant="labelLarge" style={{ marginBottom: 10, color: theme.colors.backdrop, fontWeight: 'bold', textAlign: 'center' }}>
                Available CBT Exercises
            </Text>

            <Text variant="labelMedium" style={{ marginBottom: 20, color: theme.colors.backdrop, textAlign: 'center' }}>
                What is CBT?
                Cognitive Behavioral Therapy (CBT) is a type of psychotherapy that helps you understand the relationship between your thoughts, feelings, and behaviors. It is a structured, goal-oriented approach that focuses on changing negative thought patterns to improve emotional well-being.
                Tap on an exercise to start practicing CBT techniques.
            </Text>

            <Pressable onPress={() => navigation.navigate('thoughtRecordsScreen')} style={({ pressed }) => [
                styles.pressable,
                pressed && styles.pressed, // Apply pressed styles dynamically
            ]}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant='labelLarge'>Thought Record / Log</Text>
                        <Text variant='labelMedium'>A structured way to identify and challenge negative thoughts.</Text>
                    </Card.Content>
                </Card>
            </Pressable>
        </View>
    );
}
