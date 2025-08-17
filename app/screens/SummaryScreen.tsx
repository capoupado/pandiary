import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Card, useTheme, Avatar, Button, Divider } from 'react-native-paper';
import { getEntriesFromLastWeek } from '../db/database';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

type Navigation = StackNavigationProp<any>;

export default function SummaryScreen() {
    const navigation = useNavigation<Navigation>();
    const [entries, setEntries] = useState<any[]>([]);
    const theme = useTheme();

    const fetchEntries = async () => {
        try {
            const allEntries = await getEntriesFromLastWeek();
            setEntries(allEntries);
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchEntries();
        }, [])
    );

    // Calculate statistics
    const totalEntries = entries.length;
    const averageEnergy = entries.length > 0 
        ? entries.reduce((sum, entry) => {
            const energyMap = { 'Low': 1, 'Medium': 2, 'High': 3 };
            return sum + (energyMap[entry.energy_level as keyof typeof energyMap] || 0);
        }, 0) / entries.length 
        : 0;
    
    const mostCommonMood = entries.length > 0 
        ? entries.map(entry => entry.moods).sort((a, b) =>
            entries.filter(v => v.moods === a).length - entries.filter(v => v.moods === b).length
        ).pop()
        : 'N/A';

    const formatEnergyLevel = (level: number) => {
        if (level >= 2.5) return 'High';
        if (level >= 1.5) return 'Medium';
        return 'Low';
    };

    const getDateString = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const getMoodEmoji = (mood: string) => {
        const moodEmojis: { [key: string]: string } = {
            'happy': '😊',
            'sad': '😢', 
            'angry': '😠',
            'anxious': '😰',
            'excited': '🤩',
            'calm': '😌',
            'frustrated': '😤',
            'confident': '😎',
            'bored': '😑'
        };
        
        if (!mood) return '😐';
        
        const lowerMood = mood.toLowerCase();
        for (const [key, emoji] of Object.entries(moodEmojis)) {
            if (lowerMood.includes(key)) return emoji;
        }
        return '😐';
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollContent: {
            padding: 16,
            paddingBottom: 32,
        },
        headerSection: {
            alignItems: 'center',
            marginBottom: 24,
        },
        title: {
            color: theme.colors.onBackground,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 8,
        },
        subtitle: {
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            lineHeight: 20,
        },
        statsContainer: {
            flexDirection: 'row',
            marginBottom: 24,
            gap: 12,
        },
        statCard: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
            elevation: 2,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        statNumber: {
            color: theme.colors.primary,
            fontWeight: 'bold',
            marginTop: 8,
        },
        statLabel: {
            color: theme.colors.onSurfaceVariant,
            fontSize: 12,
            textAlign: 'center',
            marginTop: 4,
        },
        sectionCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            marginBottom: 16,
            elevation: 2,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        sectionTitle: {
            color: theme.colors.onSurface,
            fontWeight: 'bold',
            marginBottom: 16,
        },
        entryCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            marginBottom: 12,
            elevation: 1,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.primary,
        },
        entryHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        entryMoodEmoji: {
            fontSize: 24,
            marginRight: 12,
        },
        entryDate: {
            color: theme.colors.onSurfaceVariant,
            fontSize: 12,
            fontWeight: '600',
        },
        entryMood: {
            color: theme.colors.onSurface,
            fontWeight: '600',
            flex: 1,
        },
        entryDetails: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
        },
        entryDetail: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        entryDetailText: {
            color: theme.colors.onSurfaceVariant,
            fontSize: 12,
            marginLeft: 4,
        },
        emptyState: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
        },
        emptyStateText: {
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            marginTop: 16,
        },
        actionButton: {
            borderRadius: 12,
            marginTop: 16,
            elevation: 2,
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text variant="headlineSmall" style={styles.title}>
                        Journal History
                    </Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>
                        Track your wellness journey over time
                    </Text>
                </View>

                {/* Statistics Cards */}
                {entries.length > 0 && (
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Avatar.Icon 
                                size={40} 
                                icon="calendar-check" 
                                style={{ backgroundColor: theme.colors.primary }}
                                color={theme.colors.onPrimary}
                            />
                            <Text variant="titleLarge" style={styles.statNumber}>
                                {totalEntries}
                            </Text>
                            <Text style={styles.statLabel}>
                                Entries This Week
                            </Text>
                        </View>

                        <View style={styles.statCard}>
                            <Avatar.Icon 
                                size={40} 
                                icon="battery-charging-high" 
                                style={{ backgroundColor: theme.colors.secondary }}
                                color={theme.colors.onSecondary}
                            />
                            <Text variant="titleLarge" style={styles.statNumber}>
                                {formatEnergyLevel(averageEnergy)}
                            </Text>
                            <Text style={styles.statLabel}>
                                Average Energy
                            </Text>
                        </View>

                        <View style={styles.statCard}>
                            <Text style={{ fontSize: 32 }}>
                                {getMoodEmoji(mostCommonMood)}
                            </Text>
                            <Text variant="titleLarge" style={[styles.statNumber, { fontSize: 14 }]}>
                                {mostCommonMood?.split(',')[0] || 'N/A'}
                            </Text>
                            <Text style={styles.statLabel}>
                                Most Common Mood
                            </Text>
                        </View>
                    </View>
                )}

                {/* Entries Section */}
                <Card style={styles.sectionCard}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Recent Entries
                        </Text>

                        {entries.length > 0 ? (
                            entries.map((item) => (
                                <TouchableOpacity 
                                    key={item.id.toString()}
                                    onPress={() => navigation.navigate('entryDetail', { entryId: item.id })}
                                >
                                    <Card style={styles.entryCard}>
                                        <Card.Content>
                                            <View style={styles.entryHeader}>
                                                <Text style={styles.entryMoodEmoji}>
                                                    {getMoodEmoji(item.moods)}
                                                </Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.entryDate}>
                                                        {getDateString(item.timestamp)}
                                                    </Text>
                                                    <Text style={styles.entryMood}>
                                                        {item.moods || 'No mood logged'}
                                                    </Text>
                                                </View>
                                            </View>
                                            
                                            <View style={styles.entryDetails}>
                                                <View style={styles.entryDetail}>
                                                    <Avatar.Icon 
                                                        size={20} 
                                                        icon="bed" 
                                                        style={{ backgroundColor: theme.colors.primaryContainer }}
                                                        color={theme.colors.primary}
                                                    />
                                                    <Text style={styles.entryDetailText}>
                                                        {item.sleep_quality || 'N/A'}
                                                    </Text>
                                                </View>
                                                
                                                <View style={styles.entryDetail}>
                                                    <Avatar.Icon 
                                                        size={20} 
                                                        icon="battery-charging-high" 
                                                        style={{ backgroundColor: theme.colors.secondaryContainer }}
                                                        color={theme.colors.secondary}
                                                    />
                                                    <Text style={styles.entryDetailText}>
                                                        {item.energy_level || 'N/A'}
                                                    </Text>
                                                </View>
                                                
                                                <View style={styles.entryDetail}>
                                                    <Avatar.Icon 
                                                        size={20} 
                                                        icon="emoticon-sad" 
                                                        style={{ backgroundColor: theme.colors.tertiaryContainer }}
                                                        color={theme.colors.tertiary}
                                                    />
                                                    <Text style={styles.entryDetailText}>
                                                        {item.stress_level || 'N/A'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Avatar.Icon 
                                    size={64} 
                                    icon="book-open-variant" 
                                    style={{ backgroundColor: theme.colors.primaryContainer }}
                                    color={theme.colors.primary}
                                />
                                <Text variant="titleMedium" style={styles.emptyStateText}>
                                    No entries yet this week
                                </Text>
                                <Text variant="bodyMedium" style={[styles.emptyStateText, { marginTop: 8 }]}>
                                    Start logging your daily wellness to track your progress
                                </Text>
                                <Button 
                                    mode="contained" 
                                    style={styles.actionButton}
                                    onPress={() => navigation.navigate('entryForm')}
                                    icon="plus-circle"
                                    contentStyle={{ paddingVertical: 8 }}
                                    labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                                >
                                    Create Your First Entry
                                </Button>
                            </View>
                        )}
                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    );
}
