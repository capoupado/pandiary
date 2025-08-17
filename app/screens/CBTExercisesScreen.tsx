import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme, Avatar, Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type Navigation = StackNavigationProp<any>;

export default function CBTExercisesScreen() {
    const navigation = useNavigation<Navigation>();
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: { 
            flex: 1, 
            backgroundColor: theme.colors.background 
        },
        scrollContent: {
            padding: 20,
            paddingBottom: 32,
        },
        headerSection: {
            alignItems: 'center',
            marginBottom: 32,
        },
        title: {
            color: theme.colors.onBackground,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 12,
        },
        subtitle: {
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: 16,
        },
        description: {
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            lineHeight: 20,
            marginBottom: 24,
        },
        exerciseCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            marginBottom: 20,
            elevation: 3,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            borderWidth: 1,
            borderColor: theme.colors.outline,
            overflow: 'hidden',
        },
        cardContent: {
            padding: 24,
        },
        exerciseHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        exerciseIcon: {
            backgroundColor: theme.colors.primaryContainer,
            marginRight: 16,
        },
        exerciseTitle: {
            color: theme.colors.onSurface,
            fontWeight: 'bold',
            fontSize: 18,
            marginBottom: 4,
        },
        exerciseDescription: {
            color: theme.colors.onSurfaceVariant,
            fontSize: 14,
            lineHeight: 20,
        },
        startButton: {
            marginTop: 16,
            borderRadius: 12,
            elevation: 2,
        },
        startButtonContent: {
            paddingVertical: 8,
            paddingHorizontal: 24,
        },
        startButtonLabel: {
            fontSize: 16,
            fontWeight: '600',
        },
        comingSoonCard: {
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 20,
            marginBottom: 20,
            elevation: 2,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
            overflow: 'hidden',
        },
        comingSoonContent: {
            padding: 24,
            opacity: 0.7,
        },
        comingSoonTitle: {
            color: theme.colors.onSurfaceVariant,
            fontWeight: '600',
            fontSize: 16,
            marginBottom: 8,
        },
        comingSoonDescription: {
            color: theme.colors.onSurfaceVariant,
            fontSize: 14,
            lineHeight: 20,
        },
        comingSoonBadge: {
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: theme.colors.tertiary,
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
        },
        comingSoonBadgeText: {
            color: theme.colors.onTertiary,
            fontSize: 10,
            fontWeight: 'bold',
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerSection}>
                    <Text variant="headlineMedium" style={styles.title}>
                        CBT Exercises
                    </Text>
                    <Text variant="titleMedium" style={styles.subtitle}>
                        Cognitive Behavioral Therapy
                    </Text>
                    <Text variant="bodyMedium" style={styles.description}>
                        CBT helps you understand the relationship between your thoughts, feelings, and behaviors. 
                        It's a structured approach to changing negative thought patterns and improving emotional well-being.
                    </Text>
                </View>

                {/* Available Exercise */}
                <Card style={styles.exerciseCard}>
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.exerciseHeader}>
                            <Avatar.Icon 
                                size={48} 
                                icon="brain" 
                                style={styles.exerciseIcon}
                                color={theme.colors.primary}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.exerciseTitle}>Thought Record / Log</Text>
                                <Text style={styles.exerciseDescription}>
                                    A structured way to identify, challenge, and reframe negative thoughts. 
                                    Track your thought patterns and learn to replace unhelpful thinking with more balanced perspectives.
                                </Text>
                            </View>
                        </View>
                        <Button 
                            mode="contained" 
                            onPress={() => navigation.navigate('thoughtRecordsScreen')}
                            style={styles.startButton}
                            contentStyle={styles.startButtonContent}
                            labelStyle={styles.startButtonLabel}
                            icon="play-circle"
                        >
                            Start Exercise
                        </Button>
                    </Card.Content>
                </Card>

                {/* Coming Soon Exercises */}
                <Card style={styles.comingSoonCard}>
                    <Card.Content style={styles.comingSoonContent}>
                        <View style={styles.comingSoonBadge}>
                            <Text style={styles.comingSoonBadgeText}>SOON</Text>
                        </View>
                        <View style={styles.exerciseHeader}>
                            <Avatar.Icon 
                                size={48} 
                                icon="meditation" 
                                style={[styles.exerciseIcon, { backgroundColor: theme.colors.secondaryContainer }]}
                                color={theme.colors.secondary}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.comingSoonTitle}>Mindfulness & Meditation</Text>
                                <Text style={styles.comingSoonDescription}>
                                    Guided mindfulness exercises and meditation sessions to help you stay present, 
                                    reduce stress, and develop a more balanced perspective on your thoughts and emotions.
                                </Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                <Card style={styles.comingSoonCard}>
                    <Card.Content style={styles.comingSoonContent}>
                        <View style={styles.comingSoonBadge}>
                            <Text style={styles.comingSoonBadgeText}>SOON</Text>
                        </View>
                        <View style={styles.exerciseHeader}>
                            <Avatar.Icon 
                                size={48} 
                                icon="chart-line" 
                                style={[styles.exerciseIcon, { backgroundColor: theme.colors.tertiaryContainer }]}
                                color={theme.colors.tertiary}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.comingSoonTitle}>Behavioral Activation</Text>
                                <Text style={styles.comingSoonDescription}>
                                    Structured activities and goal-setting exercises to help you increase positive behaviors, 
                                    improve mood, and build a more fulfilling daily routine.
                                </Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                <Card style={styles.comingSoonCard}>
                    <Card.Content style={styles.comingSoonContent}>
                        <View style={styles.comingSoonBadge}>
                            <Text style={styles.comingSoonBadgeText}>SOON</Text>
                        </View>
                        <View style={styles.exerciseHeader}>
                            <Avatar.Icon 
                                size={48} 
                                icon="heart-pulse" 
                                style={[styles.exerciseIcon, { backgroundColor: theme.colors.errorContainer }]}
                                color={theme.colors.error}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.comingSoonTitle}>Exposure Therapy</Text>
                                <Text style={styles.comingSoonDescription}>
                                    Gradual exposure exercises to help you face fears and anxieties in a safe, 
                                    controlled way, building confidence and reducing avoidance behaviors.
                                </Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    );
}
