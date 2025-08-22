// filepath: app/utils/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEntryByDate } from '../db/database';

const REMINDER_TAG = 'checkin-reminder';
const STORAGE_REMINDER_TIME = 'reminder_time'; // stores JSON { hour: number, minute: number }
const DEFAULT_TIME = { hour: 19, minute: 0 }; // 7:00 PM

// Ensure notifications show alerts when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    // iOS presentation options
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function initNotifications() {
  // Ask permissions
  const settings = await Notifications.getPermissionsAsync();
  if (!settings.granted) {
    await Notifications.requestPermissionsAsync();
  }

  // Android channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [200, 100, 200],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
}

export async function getReminderTime(): Promise<{ hour: number; minute: number }> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_REMINDER_TIME);
    if (!raw) return DEFAULT_TIME;
    const parsed = JSON.parse(raw);
    const hour = Number(parsed.hour);
    const minute = Number(parsed.minute);
    if (
      Number.isFinite(hour) &&
      Number.isFinite(minute) &&
      hour >= 0 &&
      hour <= 23 &&
      minute >= 0 &&
      minute <= 59
    ) {
      return { hour, minute };
    }
    return DEFAULT_TIME;
  } catch {
    return DEFAULT_TIME;
  }
}

export async function setReminderTime(hour: number, minute: number) {
  await AsyncStorage.setItem(STORAGE_REMINDER_TIME, JSON.stringify({ hour, minute }));
}

function atTime(date: Date, hour: number, minute: number) {
  const d = new Date(date);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function isToday(date: Date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

async function nextReminderFromNow(): Promise<Date> {
  const { hour, minute } = await getReminderTime();
  const now = new Date();
  const todayAtTime = atTime(now, hour, minute);
  if (now < todayAtTime) return todayAtTime;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return atTime(tomorrow, hour, minute);
}

async function listScheduledCheckinReminders() {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return all.filter((n) => (n.content?.data as any)?.tag === REMINDER_TAG);
}

export async function cancelCheckinReminders() {
  const toCancel = await listScheduledCheckinReminders();
  await Promise.all(toCancel.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)));
}

export async function ensureDailyCheckinReminder() {
  // If an entry already exists for today, schedule for tomorrow at configured time; otherwise today (if in the future)
  const now = new Date();
  const todayEntry = await getEntryByDate(now.toISOString());

  // Remove existing scheduled reminders to avoid duplicates/drift
  await cancelCheckinReminders();

  let fireDate = await nextReminderFromNow();

  if (todayEntry) {
    // If already checked in today and target is today, shift to tomorrow
    if (isToday(fireDate)) {
      const { hour, minute } = await getReminderTime();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      fireDate = atTime(tomorrow, hour, minute);
    }
  }

  const trigger: Notifications.DateTriggerInput = { type: 'date', date: fireDate };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to check in',
      body: 'How was your day? Log your mood and habits.',
      data: { tag: REMINDER_TAG },
      ...(Platform.OS === 'android' ? { channelId: 'reminders' } : {}),
    },
    trigger,
  });
}

export async function scheduleTomorrowReminderAfterCheckIn() {
  await cancelCheckinReminders();
  const { hour, minute } = await getReminderTime();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fireDate = atTime(tomorrow, hour, minute);

  const trigger: Notifications.DateTriggerInput = { type: 'date', date: fireDate };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to check in',
      body: 'How was your day? Log your mood and habits.',
      data: { tag: REMINDER_TAG },
      ...(Platform.OS === 'android' ? { channelId: 'reminders' } : {}),
    },
    trigger,
  });
}
