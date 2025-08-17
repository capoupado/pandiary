import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface DayData {
    date: Date;
    dayOfWeek: string;
    day: number;
    month: string;
    isToday: boolean;
    isPast: boolean;
    isFuture: boolean;
}

interface DayContentData {
    date: Date;
    content?: React.ReactNode;
}

interface WeeklyCalendarProps {
    onDayPress?: (day: DayData, index: number) => void;
    onSelectedDayChange?: (day: DayData, index: number) => void;
    actions?: React.RefObject<{ centerOnToday: () => void, selectDay: (index: number) => void }>;
    initialSelectedDay?: number;
    numberOfDaysBefore?: number;
    numberOfDaysAfter?: number;
    style?: any;
    dayContent?: DayContentData[];
}

export default function WeeklyCalendar({ 
    onDayPress,
    onSelectedDayChange,
    actions,
    numberOfDaysBefore = 5,
    numberOfDaysAfter = 5,
    initialSelectedDay = 3, 
    style,
    dayContent = []
}: WeeklyCalendarProps) {
    const theme = useTheme();
    const scrollViewRef = useRef<ScrollView>(null);
    const [scrollViewWidth, setScrollViewWidth] = useState(0);
    const [selectedDay, setSelectedDay] = useState(initialSelectedDay);

    const generateWeekData = (): DayData[] => {
        const today = new Date();
        const weekData: DayData[] = [];
        
        for (let i = -numberOfDaysBefore; i <= numberOfDaysAfter; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const isToday = i === 0;
            const isPast = i <= 0;
            const isFuture = i > 0;
            
            weekData.push({
                date,
                dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
                day: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
                isToday,
                isPast,
                isFuture
            });
        }
        
        return weekData;
    };

    const weekData = generateWeekData();

    // Helper function to get content for a specific day
    const getContentForDay = (date: Date): React.ReactNode => {
        const matchingContent = dayContent.find(content => 
            content.date.toDateString() === date.toDateString()
        );
        return matchingContent?.content || null;
    };

    const centerOnDay = (dayIndex: number) => {
        if (scrollViewRef.current && scrollViewWidth > 0) {
            const buttonWidth = 70 + 1.5; // Width of each day button
            const buttonMargin = 6; // Margin between buttons
            const contentPadding = 20; // paddingHorizontal from calendarScrollContent
            
            // Calculate the position of the target day button
            const dayLeftEdge = contentPadding + (dayIndex * buttonWidth) + (dayIndex * buttonMargin * 2);
            
            // Check if this day has a thicker border (today or selected)
            const targetDay = weekData[dayIndex];
            const hasBorderAdjustment = targetDay?.isToday || dayIndex === selectedDay;
            const borderAdjustment = hasBorderAdjustment ? 0.5 : 0;
            
            const dayVisualCenter = dayLeftEdge + (buttonWidth / 2) + borderAdjustment;
            
            // Calculate scroll position to center the day
            const scrollPosition = dayVisualCenter - (scrollViewWidth / 2);
            
            scrollViewRef.current.scrollTo({
                x: Math.max(0, scrollPosition),
                animated: true
            });
        }
    };

    const centerCurrentDay = () => {
        const todayIndex = weekData.findIndex(day => day.isToday);
        if (todayIndex !== -1) {
            centerOnDay(todayIndex);
        }
    };

    const handleDayPress = (day: DayData, index: number) => {
        if (day.isPast) {
            setSelectedDay(index);
            onDayPress?.(day, index);
            onSelectedDayChange?.(day, index);
            
            // Auto-center on the selected day with a small delay to ensure state update
            setTimeout(() => {
                centerOnDay(index);
            }, 50);
        }
    };

    // Expose the centerCurrentDay function to parent component
    useEffect(() => {
        if (actions?.current) {
            actions.current.centerOnToday = centerCurrentDay;
            actions.current.selectDay = (index: number) => {
                setSelectedDay(index);
                if (weekData[index]) {
                    onSelectedDayChange?.(weekData[index], index);
                }
            };
        }
    }, [actions, scrollViewWidth, centerCurrentDay, weekData, onSelectedDayChange]);

    useEffect(() => {
        // Auto-scroll to current day after a short delay
        const timer = setTimeout(() => {
            centerCurrentDay();
        }, 100);

        return () => clearTimeout(timer);
    }, [scrollViewWidth]);

    const styles = StyleSheet.create({
        calendarContainer: {
            marginBottom: 16,
            width: '100%',
            alignItems: 'center',
            borderRadius: 20,
            marginHorizontal: 16,
        },
        calendarScrollView: {
            width: '100%',
        },
        calendarScrollContent: {
            paddingHorizontal: 20,
            alignItems: 'center',
        },
        dayContainer: {
            alignItems: 'center',
            marginHorizontal: 6,
        },
        dayButton: {
            width: 70,
            height: 90,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        dayContentContainer: {
            marginTop: 8,
            minHeight: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        todayButton: {
            backgroundColor: theme.colors.secondary,
            borderColor: theme.colors.primary,
            borderWidth: 2,
        },
        todayText: {
            color: theme.colors.onPrimary,
        },
        selectedButton: {
            borderColor: theme.colors.tertiary,
            borderWidth: 2,
        },
        futureButton: {
            opacity: 0.3,
        },
        dayOfWeek: {
            fontSize: 11,
            fontWeight: '600',
            color: theme.colors.onSurface,
            marginBottom: 4,
            letterSpacing: 0.5,
        },
        dayNumber: {
            fontSize: 22,
            fontWeight: '700',
            color: theme.colors.onSurface,
            marginBottom: 4,
        },
        dayMonth: {
            fontSize: 10,
            fontWeight: '500',
            color: theme.colors.onSurface,
            letterSpacing: 0.3,
        },
    });

    return (
        <View style={[styles.calendarContainer, style]}>
            <ScrollView
                ref={scrollViewRef}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.calendarScrollContent}
                style={styles.calendarScrollView}
                onLayout={(event) => {
                    const width = event.nativeEvent.layout.width;
                    setScrollViewWidth(width);
                }}
            >
                {weekData.map((day, index) => {
                    const dayContent = getContentForDay(day.date);
                    
                    return (
                        <View key={index} style={styles.dayContainer}>
                            <TouchableOpacity
                                onPress={() => handleDayPress(day, index)}
                                disabled={day.isFuture}
                                style={[
                                    styles.dayButton,
                                    day.isToday && styles.todayButton,
                                    selectedDay === index && styles.selectedButton,
                                    day.isFuture && styles.futureButton
                                ]}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.dayOfWeek,
                                    day.isToday && styles.todayText,
                                    selectedDay === index && styles.selectedText
                                ]}>
                                    {day.dayOfWeek}
                                </Text>
                                <Text style={[
                                    styles.dayNumber,
                                    day.isToday && styles.todayText,
                                    selectedDay === index && styles.selectedText
                                ]}>
                                    {day.day}
                                </Text>
                                <Text style={[
                                    styles.dayMonth,
                                    day.isToday && styles.todayText,
                                    selectedDay === index && styles.selectedText
                                ]}>
                                    {day.month}
                                </Text>
                            </TouchableOpacity>
                            
                            {/* Optional content below each day */}
                            <View style={styles.dayContentContainer}>
                                {dayContent}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}
