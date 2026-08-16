export type RecordType = 'poop' | 'piss' | 'feed' | 'sleep';

export interface BabyRecord {
  id: string;
  type: RecordType;
  occurredAt: string;
  createdAt: string;
  endedAt?: string;
  durationMinutes?: number;
}

export interface ActiveSleep {
  startedAt: string;
  notificationId?: string;
}
