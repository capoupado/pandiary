import React from 'react';
import { View } from 'react-native';
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

interface SelectedDayInfoProps {
    selectedDayData: DayData | null;
}

export default function SelectedDayInfo({ selectedDayData }: SelectedDayInfoProps) {
    const theme = useTheme();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <View style={{ 
            width: '100%', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginTop: 0, 
            marginBottom: 0 
        }}>
            <Text 
                style={{ 
                    color: theme.colors.backdrop, 
                    fontWeight: 'bold', 
                    marginBottom: 4, 
                    textAlign: 'center' 
                }} 
                variant='titleMedium'
            >
                {selectedDayData ? formatDate(selectedDayData.date) : 'selected day'}
            </Text>
        </View>
    );
}
