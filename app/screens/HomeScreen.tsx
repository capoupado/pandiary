import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Avatar, FAB, Portal, Divider } from 'react-native-paper';
import { getLastEntry, clearDatabase } from '../db/database';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import MessageDialog from '../components/MessageDialog';

type Navigation = StackNavigationProp<any>;

export default function HomeScreen() {
    const navigation = useNavigation<Navigation>();
    const [todayEntry, setTodayEntry] = useState<any | null>(null);
    const [todayMood, setTodayMood] = useState<any | null>(null);
    const [helpVisible, setHelpVisible] = useState(false);
    const theme = useTheme();

    const getLastMoodEntry = async () => {
        try {
            const entry = await getLastEntry();

            if (!entry) {
                setTodayEntry(null);
                setTodayMood(null);
                return;
            }

            setTodayEntry(entry);
            setTodayMood(entry.moods);
        } catch (error) {
            console.error('Error fetching today\'s entry:', error);
        }
    };

    useEffect(() => {
        getLastMoodEntry();
    }, []);

    useFocusEffect(
        useCallback(() => {
            getLastMoodEntry();
        }, [])
    );


    const styles = StyleSheet.create({
        container: { flex: 1, padding: 8, alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: theme.colors.background },
        card: { marginBottom: 24, borderRadius: 12, padding: 16, backgroundColor: theme.colors.surface, width: '90%', borderColor: theme.colors.primary, borderWidth: 1 },
        mood: { marginTop: 8, fontWeight: 'bold', color: theme.colors.onSurface, textAlign: 'center' },
        buttonGroup: { gap: 10, alignItems: 'center', width: '90%' },
        button: { marginVertical: 4, backgroundColor: theme.colors.tertiary, width: '100%', borderColor: theme.colors.secondary, borderWidth: 1 },
        bottomButtons: { width: '100%', alignContent: 'center', justifyContent: 'center', marginVertical: 4, borderColor: theme.colors.surface, borderWidth: 1 },
        moodText: { textAlign: 'center', fontSize: 16, color: theme.colors.onSurface },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.primary,
            color: theme.colors.onSurface
        }
    });

    return (
        <>
            <Portal>
                <MessageDialog title='About Pandiary' visible={helpVisible} onDismiss={() => setHelpVisible(false)}>
                    <Text variant='labelMedium'>Welcome to Pandiary! This is your personal mood journal. You can check in daily to log your mood and view your history.</Text>
                    <Divider style={{ marginVertical: 10 }} />
                    <Text variant='labelMedium'>To get started, click the "Check In" button to log your mood for today.</Text>
                    <Text variant='labelMedium'>You can also view your past entries by using the tab 'Summary' below.</Text>
                    <Divider style={{ marginVertical: 10 }} />
                    <Text variant='labelMedium'>If you have any questions, feel free to reach out to the developer at contact@carlospoupado.com.</Text>
                </MessageDialog>
            </Portal>

            <View style={styles.container}>
                <Text variant="headlineLarge" style={{ color: theme.colors.backdrop, fontWeight: 'bold' }}>Welcome to Pandiary!</Text>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Your personal mood journal</Text>
                <Avatar.Image size={128} source={require('../../assets/my-cherryspace.png')} style={{ backgroundColor: "rgba(255,255,255,0)" }} />

                {todayEntry ? (
                    <>
                        <Card style={styles.card}>
                            <Card.Content style={{ alignItems: 'center' }}>
                                <Text variant="titleMedium">You already checked in today!</Text>
                                <Text variant='labelLarge' style={styles.mood}>You were {todayMood}</Text>
                            </Card.Content>
                        </Card>
                    </>)
                    : (<>
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text style={styles.moodText} variant="bodyMedium">You haven't logged your mood today!</Text>
                                <Text style={styles.moodText} variant="bodyMedium">Click the button below to check in.</Text>
                            </Card.Content>
                        </Card>

                    </>)}


                <View style={styles.buttonGroup}>
                    {!todayEntry ? (
                        <Button style={styles.button} mode="contained" compact={true} onPress={() => navigation.navigate('entryForm')}>
                            ➕ Check In
                        </Button>) :
                        <>
                            <Button style={styles.button} mode="contained" compact={true} onPress={() => navigation.navigate('entryDetail', { entryId: todayEntry.id })}>👁️ View Today's Entry</Button>
                        </>}
                    <Button onPress={() => navigation.navigate('Summary')} mode='contained' style={styles.bottomButtons}>
                        📜 Journal History
                    </Button>
                    <Button onPress={async () => await clearDatabase()} mode='contained' style={styles.bottomButtons}>
                        Reset Database [DEVELOPER-MODE]
                    </Button>
                </View>
                <FAB
                    icon="help-circle-outline"
                    style={styles.fab}
                    color='#fff'
                    size='small'
                    onPress={() => setHelpVisible(true)}
                />

            </View></>
    );
}

