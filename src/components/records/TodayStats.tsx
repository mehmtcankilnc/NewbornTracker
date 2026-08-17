import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useRecordTypeMeta } from "@/hooks/useRecordTypeMeta";
import { useTranslation } from "@/i18n";
import type { TodayStats as TodayStatsData } from "@/utils/stats";
import { formatDurationCompact } from "@/utils/time";

interface TodayStatsProps {
  stats: TodayStatsData;
}

export function TodayStats({ stats }: TodayStatsProps) {
  const { t } = useTranslation();
  const recordTypeMeta = useRecordTypeMeta();

  return (
    <View className="bg-surface-elevated dark:bg-surface-elevated-night rounded-card p-4 mt-6">
      <Text className="text-ink dark:text-ink-night text-base font-bold self-start border-b-2 border-primary dark:border-primary-night pb-1 mb-4">
        {t("todayStats.title")}
      </Text>
      <View className="flex-row">
        <StatColumn
          icon={recordTypeMeta.poop.icon}
          color={recordTypeMeta.poop.accent}
          value={stats.poop}
        />
        <Divider />
        <StatColumn
          icon={recordTypeMeta.piss.icon}
          color={recordTypeMeta.piss.accent}
          value={stats.piss}
        />
        <Divider />
        <StatColumn
          icon={recordTypeMeta.feed.icon}
          color={recordTypeMeta.feed.accent}
          value={stats.feed}
        />
        <Divider />
        <StatColumn
          icon={recordTypeMeta.sleep.icon}
          color={recordTypeMeta.sleep.accent}
          value={formatDurationCompact(stats.sleepMinutes, t)}
        />
      </View>
    </View>
  );
}

function Divider() {
  return <View className="w-px bg-border dark:bg-border-night mx-1" />;
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
      <Text className="text-ink dark:text-ink-night text-2xl font-extrabold mt-1">
        {value}
      </Text>
    </View>
  );
}
