export type RecordType = 'poop' | 'piss' | 'feed' | 'sleep';

export type FeedSubtype = 'breastfeeding' | 'extra_breast_milk' | 'extra_formula';

export interface BabyRecord {
  id: string;
  type: RecordType;
  occurredAt: string;
  createdAt: string;
  endedAt?: string;
  durationMinutes?: number;
  feedSubtypes?: FeedSubtype[];
  amountMl?: number;
}

export interface ActiveSleep {
  startedAt: string;
  notificationId?: string;
}
