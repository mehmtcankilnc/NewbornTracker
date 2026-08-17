import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TodayStats } from "@/components/records/TodayStats";
import { Card } from "@/components/ui/Card";
import { FeedDetailsSheet } from "@/components/ui/FeedDetailsSheet";
import { TimePickerSheet } from "@/components/ui/TimePickerSheet";
import { RECORD_TYPE_ORDER } from "@/constants/recordTypes";
import { useRecordTypeMeta } from "@/hooks/useRecordTypeMeta";
import { useTranslation } from "@/i18n";
import { scheduleSleepNotification } from "@/services/notifications";
import { useRecordsStore } from "@/stores/useRecordsStore";
import { useAppTheme } from "@/theme/useAppTheme";
import type { FeedSubtype, RecordType } from "@/types/record";
import { getTodayStats } from "@/utils/stats";
import { formatTime, todayDateLabel } from "@/utils/time";

export default function AddRecordScreen() {
  const { t, dateFnsLocale } = useTranslation();
  const { colors } = useAppTheme();
  const recordTypeMeta = useRecordTypeMeta();

  const records = useRecordsStore((s) => s.records);
  const activeSleep = useRecordsStore((s) => s.activeSleep);
  const babyName = useRecordsStore((s) => s.babyName);
  const addRecord = useRecordsStore((s) => s.addRecord);
  const startSleep = useRecordsStore((s) => s.startSleep);

  const [pickerType, setPickerType] = useState<RecordType | null>(null);
  const [pendingFeedTime, setPendingFeedTime] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const todayStats = useMemo(() => getTodayStats(records), [records]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1500);
  }

  function handleCardPress(type: RecordType) {
    if (type === "sleep" && activeSleep) {
      router.push("/stop-sleep");
      return;
    }
    setPickerType(type);
  }

  async function handleTimeSelect(occurredAtIso: string) {
    const type = pickerType;
    setPickerType(null);
    if (!type) return;

    if (type === "sleep") {
      const notificationId = await scheduleSleepNotification(occurredAtIso);
      startSleep(occurredAtIso, notificationId);
      return;
    }

    if (type === "feed") {
      setPendingFeedTime(occurredAtIso);
      return;
    }

    addRecord(type, occurredAtIso);
    showToast(
      t("home.savedToast", {
        label: recordTypeMeta[type].label,
        time: formatTime(occurredAtIso),
      }),
    );
  }

  function handleFeedDetailsConfirm(subtypes: FeedSubtype[], amountMl?: number) {
    if (!pendingFeedTime) return;
    addRecord("feed", pendingFeedTime, { feedSubtypes: subtypes, amountMl });
    showToast(t("home.feedSavedToast", { time: formatTime(pendingFeedTime) }));
    setPendingFeedTime(null);
  }

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-surface-night"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={Keyboard.dismiss}>
          <View className="flex-row items-center justify-between">
            <View className="h-9 flex-row items-center gap-1.5 border-b border-dashed border-highlight dark:border-highlight-night">
              <Ionicons name="heart" size={14} color={colors.highlight} />
              <Text className="text-highlight dark:text-highlight-night text-sm font-semibold">
                {todayDateLabel(t, dateFnsLocale)}
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/settings")}
              accessibilityRole="button"
              accessibilityLabel={t("home.settingsLabel")}
              className="h-9 w-9 rounded-full items-center justify-center bg-surface-elevated dark:bg-surface-elevated-night active:opacity-70">
              <Ionicons name="settings-outline" size={18} color={colors.ink} />
            </Pressable>
          </View>

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-ink dark:text-ink-night text-2xl font-extrabold mt-4">
            {babyName ? t("home.greetingNamed", { name: babyName }) : t("home.greetingAnon")}
          </Text>
          <Text className="text-muted dark:text-muted-night text-sm mt-1">{t("home.subtitle")}</Text>

          <View className="flex-row flex-wrap justify-between gap-y-4 mt-6">
            {RECORD_TYPE_ORDER.map((type) => {
              const meta = recordTypeMeta[type];
              const isSleeping = type === "sleep" && !!activeSleep;
              return (
                <Card
                  key={type}
                  testID={`card-${type}`}
                  label={isSleeping ? t("home.sleeping") : meta.label}
                  subtitle={
                    isSleeping
                      ? t("home.sleepingSince", {
                          time: formatTime(activeSleep!.startedAt),
                        })
                      : undefined
                  }
                  icon={meta.icon}
                  accent={meta.accent}
                  accentBg={meta.accentBg}
                  onPress={() => handleCardPress(type)}
                />
              );
            })}
          </View>

          <TodayStats stats={todayStats} />
        </Pressable>
      </ScrollView>

      {toast && (
        <View className="absolute bottom-36 left-5 right-5 items-center">
          <View className="bg-primary dark:bg-primary-night px-4 py-2.5 rounded-full">
            <Text className="text-white text-sm font-medium">{toast}</Text>
          </View>
        </View>
      )}

      <TimePickerSheet
        visible={pickerType !== null}
        title={pickerType ? recordTypeMeta[pickerType].question : ""}
        onSelect={handleTimeSelect}
        onClose={() => setPickerType(null)}
      />

      <FeedDetailsSheet
        visible={pendingFeedTime !== null}
        onConfirm={handleFeedDetailsConfirm}
        onClose={() => setPendingFeedTime(null)}
      />
    </SafeAreaView>
  );
}
