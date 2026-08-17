import AsyncStorage from '@react-native-async-storage/async-storage';

import { dismissSleepNotification } from '@/services/notifications';
import type { ActiveSleep, BabyRecord, RecordType } from '@/types/record';

/** Must match the zustand `persist` name in useRecordsStore, since the widget reads/writes the same key directly. */
const STORAGE_KEY = 'bebektakibi-records';

interface PersistedState {
  records: BabyRecord[];
  activeSleep: ActiveSleep | null;
  babyName: string;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function readState(): Promise<PersistedState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return { records: [], activeSleep: null, babyName: '' };

  const parsed = JSON.parse(raw);
  return {
    records: parsed.state?.records ?? [],
    activeSleep: parsed.state?.activeSleep ?? null,
    babyName: parsed.state?.babyName ?? '',
  };
}

async function writeState(state: PersistedState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ state, version: 0 }));
}

export async function getWidgetSnapshot(): Promise<PersistedState> {
  return readState();
}

export async function addRecordFromWidget(type: RecordType): Promise<void> {
  const state = await readState();
  const record: BabyRecord = {
    id: generateId(),
    type,
    occurredAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  await writeState({ ...state, records: [record, ...state.records] });
}

/**
 * Starts sleep tracking if idle, or stops it and saves the record if active.
 * Mirrors useRecordsStore's startSleep/stopSleep, but skips scheduling a sleep
 * notification (the widget's headless JS context isn't a great place for that);
 * a sleep started from the widget just won't have the "still sleeping" reminder.
 */
export async function toggleSleepFromWidget(): Promise<void> {
  const state = await readState();

  if (!state.activeSleep) {
    await writeState({ ...state, activeSleep: { startedAt: new Date().toISOString() } });
    return;
  }

  const { activeSleep } = state;
  const endedAt = new Date().toISOString();
  const durationMinutes = Math.max(
    1,
    Math.round((new Date(endedAt).getTime() - new Date(activeSleep.startedAt).getTime()) / 60000)
  );

  const record: BabyRecord = {
    id: generateId(),
    type: 'sleep',
    occurredAt: activeSleep.startedAt,
    createdAt: new Date().toISOString(),
    endedAt,
    durationMinutes,
  };

  await dismissSleepNotification(activeSleep.notificationId);
  await writeState({ ...state, records: [record, ...state.records], activeSleep: null });
}
