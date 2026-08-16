import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TodayStats } from "@/components/records/TodayStats";
import { Card } from "@/components/ui/Card";
import { TimePickerSheet } from "@/components/ui/TimePickerSheet";
import { RECORD_TYPE_ORDER, RECORD_TYPES } from "@/constants/recordTypes";
import { scheduleSleepNotification } from "@/services/notifications";
import { useRecordsStore } from "@/stores/useRecordsStore";
import type { RecordType } from "@/types/record";
import { getTodayStats } from "@/utils/stats";
import { formatTime, todayDateLabel } from "@/utils/time";

export default function AddRecordScreen() {
  const records = useRecordsStore((s) => s.records);
  const activeSleep = useRecordsStore((s) => s.activeSleep);
  const babyName = useRecordsStore((s) => s.babyName);
  const addRecord = useRecordsStore((s) => s.addRecord);
  const startSleep = useRecordsStore((s) => s.startSleep);
  const setBabyName = useRecordsStore((s) => s.setBabyName);

  const [pickerType, setPickerType] = useState<RecordType | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [nameInput, setNameInput] = useState(babyName);

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

  function commitName() {
    setBabyName(nameInput.trim());
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

    addRecord(type, occurredAtIso);
    showToast(
      `${RECORD_TYPES[type].label} kaydedildi · ${formatTime(occurredAtIso)}`,
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-surface"
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
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              onEndEditing={commitName}
              onSubmitEditing={commitName}
              placeholder="Bebek adı"
              placeholderTextColor="#8D8975"
              returnKeyType="done"
              maxLength={30}
              accessibilityLabel="Bebek adı"
              textAlignVertical="center"
              style={{ height: 36, paddingVertical: 0, includeFontPadding: false }}
              className="text-ink text-sm font-semibold bg-surface-elevated rounded-full px-4 min-w-[120px]"
            />

            <View className="h-9 flex-row items-center gap-1.5 border-b border-dashed border-highlight">
              <Ionicons name="heart" size={14} color="#C1512F" />
              <Text className="text-highlight text-sm font-semibold">
                {todayDateLabel()}
              </Text>
            </View>
          </View>

          {babyName ? (
            <Text className="text-ink text-2xl font-extrabold mt-4">
              Hoş geldin, {babyName}! 👶
            </Text>
          ) : null}

          <View className="flex-row flex-wrap justify-between gap-y-4 mt-6">
            {RECORD_TYPE_ORDER.map((type) => {
              const meta = RECORD_TYPES[type];
              const isSleeping = type === "sleep" && !!activeSleep;
              return (
                <Card
                  key={type}
                  testID={`card-${type}`}
                  label={isSleeping ? "Uyuyor…" : meta.label}
                  subtitle={
                    isSleeping
                      ? `${formatTime(activeSleep!.startedAt)}'den beri · Durdurmak için dokun`
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
          <View className="bg-primary px-4 py-2.5 rounded-full">
            <Text className="text-white text-sm font-medium">{toast}</Text>
          </View>
        </View>
      )}

      <TimePickerSheet
        visible={pickerType !== null}
        title={pickerType ? RECORD_TYPES[pickerType].question : ""}
        onSelect={handleTimeSelect}
        onClose={() => setPickerType(null)}
      />
    </SafeAreaView>
  );
}
