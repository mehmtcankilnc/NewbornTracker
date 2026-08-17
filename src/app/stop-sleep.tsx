import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { useElapsedTime } from '@/hooks/useElapsedTime';
import { useTranslation } from '@/i18n';
import { dismissSleepNotification } from '@/services/notifications';
import { useRecordsStore } from '@/stores/useRecordsStore';
import { useAppTheme } from '@/theme/useAppTheme';
import { formatTime } from '@/utils/time';

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
  const activeSleep = useRecordsStore((s) => s.activeSleep);
  const stopSleep = useRecordsStore((s) => s.stopSleep);
  const elapsed = useElapsedTime(activeSleep?.startedAt);

  function handleStop() {
    if (!activeSleep) {
      goHome();
      return;
    }
    const notificationId = activeSleep.notificationId;
    stopSleep();
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

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-surface-night" edges={['top', 'left', 'right']}>
      <Header />
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-muted dark:text-muted-night text-sm">
          {t('stopSleep.sleepingSince', { time: formatTime(activeSleep.startedAt) })}
        </Text>
        <Text
          className="text-ink dark:text-ink-night text-5xl font-bold mt-3 mb-10"
          style={{ fontVariant: ['tabular-nums'] }}>
          {elapsed}
        </Text>
        <Button label={t('stopSleep.stop')} onPress={handleStop} />
      </View>
    </SafeAreaView>
  );
}
