import { useState, useCallback } from 'react';
import { getEntryByDate } from '../db/database';

export const useMoodEntry = () => {
    const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Normalize date to start of day in local timezone
    const normalizeDate = (date: Date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
    };

    const fetchEntryByDate = useCallback(async (date: Date) => {
        setIsLoading(true);
        try {
            const normalizedDate = normalizeDate(date);
            const dateString = normalizedDate.toISOString();
            console.log('Fetching entry for normalized date:', dateString);
            const entry = await getEntryByDate(dateString);
            console.log('Found entry:', entry);
            setSelectedEntry(entry);
            return entry;
        } catch (error) {
            console.error('Error fetching entry:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchTodayEntry = useCallback(() => {
        return fetchEntryByDate(new Date());
    }, [fetchEntryByDate]);

    return {
        selectedEntry,
        isLoading,
        fetchEntryByDate,
        fetchTodayEntry,
        setSelectedEntry
    };
};
