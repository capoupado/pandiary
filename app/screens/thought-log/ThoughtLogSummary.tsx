import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme, Button } from 'react-native-paper';
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
        container: { flex: 1, padding: 16, backgroundColor: theme.colors.background },
        card: { marginVertical: 8, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 1, borderRadius: 12 },
        tags: { marginTop: 4, fontStyle: 'italic' }
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

    return (
        <View style={styles.container}>
            <Text variant="labelLarge" style={{ marginBottom: 10, color: theme.colors.backdrop, fontWeight: 'bold', textAlign: 'center' }}>
                Your Thought Log
            </Text>

            <Text variant="labelMedium" style={{ marginBottom: 20, color: theme.colors.backdrop, textAlign: 'center' }}>
                Tap on an entry to view more details.
            </Text>

            <Button onPress={() => navigation.navigate('thoughtLogEntry', { mode: 'create' })} mode='contained'>
                ➕ Add New Thought Log
            </Button>

            <FlatList
                data={thoughtLogs}
                keyExtractor={item => item.id?.toString() || Math.random().toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('thoughtLogView', { log: item })}>
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text variant='labelSmall' style={{ color: theme.colors.onSurface }}>
                                    {new Date(item.timestamp).toDateString()}
                                </Text>
                                <Text variant='titleMedium' style={{ color: theme.colors.onSurface, marginTop: 4 }}>
                                    {item.situation.length > 50 ? item.situation.substring(0, 50) + '...' : item.situation}
                                </Text>
                                <Text variant='bodyMedium' style={styles.tags}>
                                    Emotions: {item.emotions}
                                </Text>
                                <Text variant='bodySmall' style={{ color: theme.colors.onSurface, marginTop: 4 }}>
                                    {item.automatic_thoughts.length > 60 ? item.automatic_thoughts.substring(0, 60) + '...' : item.automatic_thoughts}
                                </Text>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                        <Text variant='bodyMedium' style={{ color: theme.colors.backdrop, textAlign: 'center' }}>
                            No thought logs yet.{'\n'}Create your first one by tapping the button above!
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}
