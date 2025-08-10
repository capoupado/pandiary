import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { getEntriesFromLastWeek } from '../db/database';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

type Navigation = StackNavigationProp<any>;

export default function SummaryScreen() {
    const navigation = useNavigation<Navigation>();
    const [entries, setEntries] = useState<any[]>([]);
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: { flex: 1, padding: 16, backgroundColor: theme.colors.background },
        card: { marginVertical: 8, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 1, borderRadius: 12 },
        tags: { marginTop: 4, fontStyle: 'italic' }
    });

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

    return (
        <View style={styles.container}>
            <Text variant="labelLarge" style={{ marginBottom: 10, color: theme.colors.backdrop, fontWeight: 'bold', textAlign: 'center' }}>
                Your Pandiary Entries (Last 7 Days)
            </Text>

            <Text variant="labelMedium" style={{ marginBottom: 20, color: theme.colors.backdrop, textAlign: 'center' }}>
                Tap on an entry to view more details.
                If you have enough entries this week, you can ask for a weekly summary report.
            </Text>

            <FlatList
                data={entries}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('entryDetail', { entryId: item.id })}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text variant='labelSmall'>{new Date(item.timestamp).toDateString()}</Text>
                            <Text variant='labelMedium'>{item.moods}</Text>
                        </Card.Content>
                    </Card>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
