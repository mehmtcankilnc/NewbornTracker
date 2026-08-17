import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';

import { Button } from '@/components/ui/Button';
import { useElapsedTime } from '@/hooks/useElapsedTime';
import { useTranslation } from '@/i18n';
import { dismissSleepNotification } from '@/services/notifications';
import { useRecordsStore } from '@/stores/useRecordsStore';
import { useAppTheme } from '@/theme/useAppTheme';
import { combineTodayWithTime, formatTime, getQuickPickOptions, offsetToIso } from '@/utils/time';

type Selection = { kind: 'quick'; minutesAgo: number } | { kind: 'custom'; date: Date };

function goHome() {
  // Clears any stacked screens (e.g. repeated notification taps) instead of
  // just popping one level, so Home is always the single entry left behind.
  router.dismissTo('/');
}

function Header() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center px-5 pt-4 pb-2">
      <Pressable
        onPress={goHome}
        accessibilityRole="button"
        accessibilityLabel={t('stopSleep.back')}
        className="h-9 w-9 rounded-full items-center justify-center bg-surface-elevated dark:bg-surface-elevated-night active:opacity-70">
        <Ionicons name="arrow-back" size={18} color={colors.ink} />
      </Pressable>
      <Text className="text-ink dark:text-ink-night text-base font-bold ml-3">{t('stopSleep.title')}</Text>
    </View>
  );
}

export default function StopSleepScreen() {
  const { t } = useTranslation();
  const { scheme } = useAppTheme();
  const activeSleep = useRecordsStore((s) => s.activeSleep);
  const stopSleep = useRecordsStore((s) => s.stopSleep);
  const elapsed = useElapsedTime(activeSleep?.startedAt);

  const [selection, setSelection] = useState<Selection>({ kind: 'quick', minutesAgo: 0 });
  const [showPicker, setShowPicker] = useState(false);

  const quickPickOptions = getQuickPickOptions(t);

  function handleStop() {
    if (!activeSleep) {
      goHome();
      return;
    }
    const notificationId = activeSleep.notificationId;
    const endedAtIso =
      selection.kind === 'quick' ? offsetToIso(selection.minutesAgo) : combineTodayWithTime(selection.date);
    stopSleep(endedAtIso);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    goHome();
    // Fire-and-forget: navigation already happened, no need to block on this.
    dismissSleepNotification(notificationId);
  }

  if (!activeSleep) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-surface-night" edges={['top', 'left', 'right']}>
        <Header />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-ink dark:text-ink-night text-lg font-semibold text-center">
            {t('stopSleep.noActiveSleep')}
          </Text>
          <Text className="text-muted dark:text-muted-night text-sm text-center mt-1 mb-6">
            {t('stopSleep.alreadyStopped')}
          </Text>
          <Button label={t('stopSleep.goHome')} onPress={goHome} />
        </View>
      </SafeAreaView>
    );
  }

  const customLabel =
    selection.kind === 'custom'
      ? t('timePicker.customSelected', { time: formatTime(selection.date.toISOString()) })
      : t('timePicker.customLabel');

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-surface-night" edges={['top', 'left', 'right']}>
      <Header />
      <View className="flex-1 items-center px-8 pt-6">
        <Text className="text-muted dark:text-muted-night text-sm">
          {t('stopSleep.sleepingSince', { time: formatTime(activeSleep.startedAt) })}
        </Text>
        <Text
          className="text-ink dark:text-ink-night text-5xl font-bold mt-3 mb-8"
          style={{ fontVariant: ['tabular-nums'] }}>
          {elapsed}
        </Text>

        <Text className="text-ink dark:text-ink-night text-base font-semibold self-start mb-3">
          {t('stopSleep.selectEndTime')}
        </Text>

        <View className="w-full gap-2">
          {quickPickOptions.map((option) => {
            const isSelected = selection.kind === 'quick' && selection.minutesAgo === option.minutesAgo;
            return (
              <Pressable
                key={option.label}
                onPress={() => setSelection({ kind: 'quick', minutesAgo: option.minutesAgo })}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                className={`min-h-[48px] rounded-full flex-row items-center justify-between px-4 active:opacity-70 ${
                  isSelected ? 'bg-primary dark:bg-primary-night' : 'bg-surface-elevated dark:bg-surface-elevated-night'
                }`}>
                <Text
                  className={`text-base ${
                    isSelected ? 'text-white font-semibold' : 'text-ink dark:text-ink-night'
                  }`}>
                  {option.label}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => setShowPicker(true)}
            accessibilityRole="button"
            accessibilityLabel={t('timePicker.customLabel')}
            className={`min-h-[48px] rounded-full flex-row items-center justify-between px-4 active:opacity-70 ${
              selection.kind === 'custom' ? 'bg-primary dark:bg-primary-night' : 'bg-surface-elevated dark:bg-surface-elevated-night'
            }`}>
            <Text
              className={`text-base ${
                selection.kind === 'custom' ? 'text-white font-semibold' : 'text-ink dark:text-ink-night'
              }`}>
              {customLabel}
            </Text>
            {selection.kind === 'custom' && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
          </Pressable>
        </View>

        <View className="w-full mt-8 mb-6">
          <Button label={t('stopSleep.stop')} onPress={handleStop} />
        </View>
      </View>

      <DatePicker
        modal
        open={showPicker}
        mode="time"
        theme={scheme}
        date={selection.kind === 'custom' ? selection.date : new Date()}
        title={t('timePicker.pickTimeTitle')}
        confirmText={t('timePicker.pickerConfirm')}
        cancelText={t('timePicker.pickerCancel')}
        onConfirm={(date) => {
          setSelection({ kind: 'custom', date });
          setShowPicker(false);
        }}
        onCancel={() => setShowPicker(false)}
      />
    </SafeAreaView>
  );
}
