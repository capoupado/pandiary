import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, FAB, Portal, Divider } from 'react-native-paper';
import { clearDatabase, getStreak } from '../db/database';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import MessageDialog from '../components/MessageDialog';
import WeeklyCalendar from '../components/WeeklyCalendar';
import SelectedDayInfo from '../components/SelectedDayInfo';
import InfoCard from '../components/InfoCard';
import InfoCardRow from '../components/InfoCardRow';
import { useMoodEntry } from '../hooks/useMoodEntry';
import { useWeeklyCalendar } from '../hooks/useWeeklyCalendar';
import { formatDate } from '../utils/utils';

type Navigation = StackNavigationProp<any>;

export default function HomeScreen() {
    const navigation = useNavigation<Navigation>();
    const [helpVisible, setHelpVisible] = useState(false);
    const theme = useTheme();
    const [streak, setStreak] = useState<number>(0);

    // Custom hooks
    const { selectedEntry, fetchEntryByDate, fetchTodayEntry } = useMoodEntry();
    const { selectedDayData, actions, handleSelectedDayChange } = useWeeklyCalendar();
    const [todayEntry, setTodayEntry] = useState<any | null>(null);

    const handleDayPress = useCallback(async (day: any, index: number) => {
        await fetchEntryByDate(day.date);
    }, [fetchEntryByDate]);

    const handleDayChange = useCallback(async (day: any, index: number) => {
        handleSelectedDayChange(day, index);
        await fetchEntryByDate(day.date);
    }, [handleSelectedDayChange, fetchEntryByDate]);

    // Example day content - you can customize this based on your app's data
    const createDayContent = () => {
        const content = [];
        const today = new Date();

        // Add example content for past few days
        for (let i = -3; i <= 0; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            if (i === 0) {
                // Today - show if mood was logged
                content.push({
                    date,
                    content: <Text style={{ fontSize: 12, color: theme.colors.backdrop }}>Today</Text>
                });
            }
        }

        return content;
    };

    // Helper to check if a date is today
    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    useFocusEffect(
        useCallback(() => {
            actions?.current?.centerOnToday();
            actions?.current?.selectDay(5); // Today

            // Fetch today's entry specifically for the button logic
            const fetchTodayEntryForButtons = async () => {
                const entry = await fetchEntryByDate(new Date());
                setTodayEntry(entry);
            };

            fetchTodayEntryForButtons();
        }, [fetchEntryByDate])
    );

    useEffect(() => {
        const fetchStreak = async () => {
            const streak = await getStreak();
            setStreak(streak);
        };
        fetchStreak();
    }, []);


    const styles = StyleSheet.create({
        weeklyCalendarContainer: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 64,
            marginBottom: 0,
        },
        weeklyCalendar: {
        },
        container: {
            alignItems: 'center',
        },
        card: { marginBottom: 24, borderRadius: 12, padding: 16, width: '90%', borderColor: theme.colors.primary, borderWidth: 1 },
        mood: { marginTop: 8, fontWeight: 'bold', color: theme.colors.onSurface, textAlign: 'center' },
        buttonGroup: { gap: 16, alignItems: 'center', width: '90%' },
        primaryButton: {
            marginVertical: 8,
            width: '90%',
            borderRadius: 12,
            elevation: 4,
            alignSelf: 'center',
            backgroundColor: theme.colors.tertiary,
        },
        secondaryButton: {
            width: '100%',
            marginVertical: 4,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: theme.colors.outline,
            elevation: 2,
        },
        moodText: { textAlign: 'center', fontSize: 16, color: theme.colors.onSurface },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.primary,
        },
        emptyStateContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingVertical: 40,
        },
        emptyStateCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            padding: 32,
            alignItems: 'center',
            width: '100%',
            maxWidth: 350,
            elevation: 2,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
        },
        emptyStateIconContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.primaryContainer,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
        },
        emptyStateEmoji: {
            fontSize: 36,
        },
        emptyStateTitle: {
            textAlign: 'center',
            color: theme.colors.onSurface,
            fontWeight: 'bold',
            marginBottom: 12,
        },
        emptyStateSubtitle: {
            textAlign: 'center',
            color: theme.colors.onSurfaceVariant,
            lineHeight: 22,
            marginBottom: 28,
        },
        emptyStateButton: {
            borderRadius: 12,
            elevation: 2,
        },
        emptyStateButtonSecondary: {
            borderRadius: 12,
            borderColor: theme.colors.primary,
            borderWidth: 2,
        }
    });

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
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

                {/* Weekly Calendar */}
                <View style={styles.weeklyCalendarContainer}>
                    <WeeklyCalendar
                        onDayPress={handleDayPress}
                        onSelectedDayChange={handleDayChange}
                        dayContent={createDayContent()}
                        actions={actions}
                        style={styles.weeklyCalendar}
                    />
                </View>

                {/* Weekly mood trend, streak counter, or quick insights */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                    <InfoCard
                        title={streak.toString() + " day(s) in a row!"}
                        subtitle="Logging streak"
                        icon={streak > 0 ? "fire" : "fire-off"}
                        backgroundColor={theme.colors.secondary}
                        titleColor={theme.colors.onSecondary}
                        subtitleColor={theme.colors.onSecondary}
                        borderColor={theme.colors.tertiary}
                        iconColor={theme.colors.onSurface}
                    />
                    <InfoCard
                        title="Did you drink water today?"
                        subtitle="Stay hydrated"
                        icon="water"
                        backgroundColor={theme.colors.secondary}
                        titleColor={theme.colors.onSecondary}
                        subtitleColor={theme.colors.onSecondary}
                        borderColor={theme.colors.tertiary}
                        iconColor={theme.colors.onSurface}
                    />
                    <InfoCard
                        title="Did you exercise today?"
                        subtitle="Stay active"
                        icon="dumbbell"
                        backgroundColor={theme.colors.secondary}
                        titleColor={theme.colors.onSecondary}
                        subtitleColor={theme.colors.onSecondary}
                        borderColor={theme.colors.tertiary}
                        iconColor={theme.colors.onSurface}
                    />
                </ScrollView>

                <SelectedDayInfo selectedDayData={selectedDayData} />

                {selectedEntry ? (
                    <>
                        <InfoCardRow>
                            <InfoCard
                                title="Sleep"
                                subtitle={selectedEntry?.sleep_quality + " " + selectedEntry?.sleep_time + "h"}
                                icon="bed"
                                backgroundColor={theme.colors.primary}
                                borderColor={theme.colors.secondary}
                            />
                            <InfoCard
                                title="Energy"
                                subtitle={selectedEntry?.energy_level || "Didn't log."}
                                icon="battery-charging-high"
                                backgroundColor={theme.colors.primary}
                                borderColor={theme.colors.primary}
                            />
                        </InfoCardRow>

                        <InfoCardRow>
                            <InfoCard
                                title="Body Feel"
                                subtitle={selectedEntry?.body_feel || "Didn't log."}
                                icon="dumbbell"
                                backgroundColor={theme.colors.primary}
                                borderColor={theme.colors.primary}
                            />
                        </InfoCardRow>

                        <InfoCardRow>
                            <InfoCard
                                title="Moods"
                                subtitle={selectedEntry?.moods || "Didn't log."}
                                icon="emoticon-happy"
                                backgroundColor={theme.colors.primary}
                                borderColor={theme.colors.primary}
                            />
                        </InfoCardRow>

                        <InfoCardRow>
                            <InfoCard
                                title="Appetite"
                                subtitle={selectedEntry?.appetite || "Didn't log."}
                                icon="food"
                                backgroundColor={theme.colors.primary}
                                borderColor={theme.colors.primary}
                            />
                            <InfoCard
                                title="Anxiety"
                                subtitle={selectedEntry?.anxiety || "Didn't log."}
                                icon="emoticon-sad"
                                backgroundColor={theme.colors.primary}
                                borderColor={theme.colors.primary}
                            />
                        </InfoCardRow>

                        <InfoCardRow>
                            <InfoCard
                                title="Motivation"
                                subtitle={selectedEntry?.motivation || "Didn't log."}
                                icon="emoticon-happy"
                                backgroundColor={theme.colors.primary}
                                borderColor={theme.colors.primary}
                            />
                            <InfoCard
                                title="Stress"
                                subtitle={selectedEntry?.stress_level || "Didn't log."}
                                icon="emoticon-sad"
                                backgroundColor={theme.colors.primary}
                                borderColor={theme.colors.primary}
                            />
                        </InfoCardRow>

                    {/* Show Check In button only if there's no entry for today AND today is selected */}
                    {!todayEntry && selectedDayData?.isToday ? (
                            <Button
                                style={styles.primaryButton}
                                mode="contained"
                                icon="plus-circle"
                                contentStyle={{ paddingVertical: 8 }}
                                labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                                onPress={() => navigation.navigate('entryForm')}
                            >
                                Check In Today
                            </Button>
                        ) : selectedEntry ? (
                            <Button
                                style={styles.primaryButton}
                                mode="contained"
                                icon="eye"
                                contentStyle={{ paddingVertical: 8 }}
                                labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                                onPress={() => navigation.navigate('entryDetail', { entryId: selectedEntry.id })}
                            >
                                View More Details
                            </Button>
                        ) : null}
                    </>
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <View style={styles.emptyStateCard}>
                            {/* Icon Section */}
                            <View style={styles.emptyStateIconContainer}>
                                <Text style={styles.emptyStateEmoji}>📝</Text>
                            </View>
                            
                            {/* Content Section */}
                            <Text variant="headlineSmall" style={styles.emptyStateTitle}>
                                {selectedDayData?.isToday ? "Ready to check in?" : "No entry for this day"}
                            </Text>
                            
                            <Text variant="bodyMedium" style={styles.emptyStateSubtitle}>
                                {selectedDayData?.isToday 
                                    ? "Track your mood, energy, and wellbeing to build healthy habits"
                                    : selectedDayData?.isFuture 
                                        ? "The future is unwritten. Focus on today!"
                                        : "This day hasn't been logged yet"
                                }
                            </Text>
                            
                            {/* Action Button */}
                            {selectedDayData?.isToday ? (
                                <Button
                                    mode="contained"
                                    icon="plus-circle-outline"
                                    style={styles.emptyStateButton}
                                    contentStyle={{ paddingVertical: 12, paddingHorizontal: 24 }}
                                    labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                                    onPress={() => navigation.navigate('entryForm')}
                                >
                                    Log Your Day
                                </Button>
                            ) : !selectedDayData?.isFuture ? (
                                <Button
                                    mode="outlined"
                                    icon="calendar-edit"
                                    style={styles.emptyStateButtonSecondary}
                                    contentStyle={{ paddingVertical: 8, paddingHorizontal: 20 }}
                                    labelStyle={{ fontSize: 14, fontWeight: '600' }}
                                    onPress={() => navigation.navigate('entryForm')}
                                >
                                    Log This Day
                                </Button>
                            ) : null}
                        </View>
                    </View>
                )}
            </ScrollView>
            <FAB
                icon="help-circle-outline"
                style={styles.fab}
                color={theme.colors.background}
                size='small'
                onPress={() => setHelpVisible(true)}
            />
        </View>
    );
}

