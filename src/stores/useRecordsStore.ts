import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ActiveSleep, BabyRecord, RecordType } from '@/types/record';

interface RecordsState {
  records: BabyRecord[];
  activeSleep: ActiveSleep | null;
  babyName: string;
  addRecord: (type: RecordType, occurredAt: string) => void;
  startSleep: (startedAt: string, notificationId?: string) => void;
  stopSleep: () => void;
  deleteRecord: (id: string) => void;
  setBabyName: (name: string) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useRecordsStore = create<RecordsState>()(
  persist(
    (set, get) => ({
      records: [],
      activeSleep: null,
      babyName: '',

      addRecord: (type, occurredAt) => {
        const record: BabyRecord = {
          id: generateId(),
          type,
          occurredAt,
          createdAt: new Date().toISOString(),
        };
        set({ records: [record, ...get().records] });
      },

      startSleep: (startedAt, notificationId) => {
        set({ activeSleep: { startedAt, notificationId } });
      },

      stopSleep: () => {
        const { activeSleep, records } = get();
        if (!activeSleep) return;

        const endedAt = new Date().toISOString();
        const durationMinutes = Math.max(
          1,
          Math.round(
            (new Date(endedAt).getTime() - new Date(activeSleep.startedAt).getTime()) / 60000
          )
        );

        const record: BabyRecord = {
          id: generateId(),
          type: 'sleep',
          occurredAt: activeSleep.startedAt,
          createdAt: new Date().toISOString(),
          endedAt,
          durationMinutes,
        };

        set({ records: [record, ...records], activeSleep: null });
      },

      deleteRecord: (id) => {
        set({ records: get().records.filter((r) => r.id !== id) });
      },

      setBabyName: (name) => {
        set({ babyName: name });
      },
    }),
    {
      name: 'bebektakibi-records',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
