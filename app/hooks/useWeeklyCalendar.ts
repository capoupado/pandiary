import { useState, useRef, useCallback } from 'react';

interface DayData {
    date: Date;
    dayOfWeek: string;
    day: number;
    month: string;
    isToday: boolean;
    isPast: boolean;
    isFuture: boolean;
}

export const useWeeklyCalendar = () => {
    const [selectedDayData, setSelectedDayData] = useState<DayData | null>(null);
    const actions = useRef<{ centerOnToday: () => void, selectDay: (index: number) => void }>({
        centerOnToday: () => {},
        selectDay: () => {}
    });

    const handleSelectedDayChange = useCallback((day: DayData, index: number) => {
        setSelectedDayData(day);
    }, []);

    const centerOnToday = useCallback(() => {
        actions.current?.centerOnToday();
    }, []);

    const selectDay = useCallback((index: number) => {
        actions.current?.selectDay(index);
    }, []);

    return {
        selectedDayData,
        actions,
        handleSelectedDayChange,
        centerOnToday,
        selectDay
    };
};
