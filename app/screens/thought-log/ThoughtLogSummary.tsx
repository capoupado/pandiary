import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme, Button, Avatar, IconButton } from 'react-native-paper';
import { getThoughtLogs, ThoughtLog } from '../../db/database';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

type RootStackParamList = {
    thoughtLogEntry: { mode: 'create' | 'edit', logId?: number };
    thoughtLogView: { log: ThoughtLog };
};

export default function ThoughtLogSummary() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [thoughtLogs, setThoughtLogs] = useState<ThoughtLog[]>([]);
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
            lineHeight: 20,
            marginBottom: 24,
        },
        addButton: {
            borderRadius: 16,
            marginBottom: 24,
            elevation: 3,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
        },
        addButtonContent: {
            paddingVertical: 12,
            paddingHorizontal: 24,
        },
        addButtonLabel: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        card: { 
            marginVertical: 8, 
            backgroundColor: theme.colors.surface, 
            borderColor: theme.colors.outline, 
            borderWidth: 1.5, 
            borderRadius: 20,
            elevation: 2,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            overflow: 'hidden',
        },
        cardContent: {
            padding: 20,
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
        },
        dateText: {
            color: theme.colors.onSurfaceVariant,
            fontSize: 14,
            fontWeight: '600',
        },
        editButton: {
            margin: 0,
            padding: 0,
        },
        situationText: {
            color: theme.colors.onSurface,
            fontWeight: '600',
            fontSize: 16,
            marginBottom: 8,
            lineHeight: 22,
        },
        emotionsText: {
            color: theme.colors.onSurfaceVariant,
            fontSize: 14,
            marginBottom: 8,
            fontStyle: 'italic',
        },
        thoughtsText: {
            color: theme.colors.onSurfaceVariant,
            fontSize: 14,
            lineHeight: 20,
        },
        emptyState: {
            alignItems: 'center',
            marginTop: 60,
            paddingHorizontal: 20,
        },
        emptyStateIcon: {
            backgroundColor: theme.colors.primaryContainer,
            marginBottom: 24,
        },
        emptyStateTitle: {
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            marginBottom: 12,
            lineHeight: 22,
        },
        emptyStateSubtitle: {
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            lineHeight: 20,
            opacity: 0.8,
        },
    });

    const fetchThoughtLogs = async () => {
        try {
            const allThoughtLogs = await getThoughtLogs();
            setThoughtLogs(allThoughtLogs);
        } catch (error) {
            console.error('Error fetching thought logs:', error);
        }
    };

    useEffect(() => {
        fetchThoughtLogs();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchThoughtLogs();
        }, [])
    );

    const formatDate = (timestamp: string) => {
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

    return (
        <View style={styles.container}>
            <FlatList
                data={thoughtLogs}
                keyExtractor={item => item.id?.toString() || Math.random().toString()}
                contentContainerStyle={styles.scrollContent}
                ListHeaderComponent={() => (
                    <View style={styles.headerSection}>
                        <Text variant="headlineMedium" style={styles.title}>
                            Thought Records
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            Track your cognitive restructuring journey and practice CBT techniques
                        </Text>

                        <Button 
                            onPress={() => navigation.navigate('thoughtLogEntry', { mode: 'create' })} 
                            mode='contained'
                            style={styles.addButton}
                            contentStyle={styles.addButtonContent}
                            labelStyle={styles.addButtonLabel}
                            icon="plus-circle"
                        >
                            Add New Thought Record
                        </Button>
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('thoughtLogView', { log: item })}>
                        <Card style={styles.card}>
                            <Card.Content style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.dateText}>
                                        {formatDate(item.timestamp)}
                                    </Text>
                                    <IconButton
                                        icon="pencil"
                                        size={20}
                                        onPress={() => navigation.navigate('thoughtLogEntry', { mode: 'edit', logId: item.id })}
                                        style={styles.editButton}
                                        iconColor={theme.colors.primary}
                                    />
                                </View>
                                
                                <Text style={styles.situationText}>
                                    {item.situation.length > 60 ? item.situation.substring(0, 60) + '...' : item.situation}
                                </Text>
                                
                                <Text style={styles.emotionsText}>
                                    Emotions: {item.emotions}
                                </Text>
                                
                                <Text style={styles.thoughtsText}>
                                    {item.automatic_thoughts.length > 80 ? item.automatic_thoughts.substring(0, 80) + '...' : item.automatic_thoughts}
                                </Text>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <Avatar.Icon 
                            size={80} 
                            icon="brain" 
                            style={styles.emptyStateIcon}
                            color={theme.colors.primary}
                        />
                        <Text variant="titleMedium" style={styles.emptyStateTitle}>
                            No thought records yet
                        </Text>
                        <Text variant="bodyMedium" style={styles.emptyStateSubtitle}>
                            Start your cognitive behavioral therapy journey by creating your first thought record. 
                            It's a powerful tool for understanding and changing negative thought patterns.
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}
