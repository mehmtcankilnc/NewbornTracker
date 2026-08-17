import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { dismissSleepNotification } from '@/services/notifications';
import type { ActiveSleep, BabyRecord, FeedSubtype, RecordType } from '@/types/record';
import { syncWidget } from '@/widgets/syncWidget';

export interface FeedDetails {
  feedSubtypes?: FeedSubtype[];
  amountMl?: number;
}

export interface RecordEdits {
  occurredAt: string;
  feedSubtypes?: FeedSubtype[];
  amountMl?: number;
}

interface RecordsState {
  records: BabyRecord[];
  activeSleep: ActiveSleep | null;
  babyName: string;
  hasHydrated: boolean;
  addRecord: (type: RecordType, occurredAt: string, details?: FeedDetails) => void;
  updateRecord: (id: string, edits: RecordEdits) => void;
  startSleep: (startedAt: string, notificationId?: string) => void;
  stopSleep: (endedAt?: string) => void;
  deleteRecord: (id: string) => void;
  clearRecords: () => void;
  setBabyName: (name: string) => void;
  setHasHydrated: (value: boolean) => void;
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
      hasHydrated: false,

      addRecord: (type, occurredAt, details) => {
        const record: BabyRecord = {
          id: generateId(),
          type,
          occurredAt,
          createdAt: new Date().toISOString(),
          ...(details?.feedSubtypes?.length ? { feedSubtypes: details.feedSubtypes } : {}),
          ...(details?.amountMl != null ? { amountMl: details.amountMl } : {}),
        };
        set({ records: [record, ...get().records] });
        syncWidget();
      },

      updateRecord: (id, edits) => {
        set({
          records: get().records.map((r) =>
            r.id === id
              ? {
                  ...r,
                  occurredAt: edits.occurredAt,
                  feedSubtypes: edits.feedSubtypes,
                  amountMl: edits.amountMl,
                }
              : r
          ),
        });
        syncWidget();
      },

      startSleep: (startedAt, notificationId) => {
        set({ activeSleep: { startedAt, notificationId } });
        syncWidget();
      },

      stopSleep: (endedAtOverride) => {
        const { activeSleep, records } = get();
        if (!activeSleep) return;

        const endedAt = endedAtOverride ?? new Date().toISOString();
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
        syncWidget();
      },

      deleteRecord: (id) => {
        set({ records: get().records.filter((r) => r.id !== id) });
        syncWidget();
      },

      clearRecords: () => {
        const { activeSleep } = get();
        dismissSleepNotification(activeSleep?.notificationId);
        set({ records: [], activeSleep: null });
        syncWidget();
      },

      setBabyName: (name) => {
        set({ babyName: name });
        syncWidget();
      },

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: 'bebektakibi-records',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
