import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { RECORD_TYPES } from '@/constants/recordTypes';
import type { TodayStats as TodayStatsData } from '@/utils/stats';
import { formatDurationCompact } from '@/utils/time';

interface TodayStatsProps {
  stats: TodayStatsData;
}

export function TodayStats({ stats }: TodayStatsProps) {
  return (
    <View className="bg-surface-elevated rounded-card p-4 mt-6">
      <Text className="text-ink text-base font-bold self-start border-b-2 border-primary pb-1 mb-4">
        Bugün
      </Text>
      <View className="flex-row">
        <StatColumn
          icon={RECORD_TYPES.poop.icon}
          color={RECORD_TYPES.poop.accent}
          value={stats.poop}
        />
        <Divider />
        <StatColumn
          icon={RECORD_TYPES.piss.icon}
          color={RECORD_TYPES.piss.accent}
          value={stats.piss}
        />
        <Divider />
        <StatColumn
          icon={RECORD_TYPES.feed.icon}
          color={RECORD_TYPES.feed.accent}
          value={stats.feed}
        />
        <Divider />
        <StatColumn
          icon={RECORD_TYPES.sleep.icon}
          color={RECORD_TYPES.sleep.accent}
          value={formatDurationCompact(stats.sleepMinutes)}
        />
      </View>
    </View>
  );
}

function Divider() {
  return <View className="w-px bg-border mx-1" />;
}

interface StatColumnProps {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  value: number | string;
}

function StatColumn({ icon, color, value }: StatColumnProps) {
  return (
    <View className="flex-1 items-center">
      <Ionicons name={icon} size={20} color={color} />
      <Text className="text-ink text-2xl font-extrabold mt-1">{value}</Text>
      <View className="w-6 border-b border-dashed border-border mt-1.5" />
    </View>
  );
}
