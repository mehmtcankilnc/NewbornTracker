import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

import { interpolate, resolve, type TranslationKey } from '@/i18n/core';
import { en, tr } from '@/i18n/translations';
import { useSettingsStore } from '@/stores/useSettingsStore';

export { dismissSleepNotification } from './dismissSleepNotification';

const SLEEP_CHANNEL_ID = 'sleep-tracking';

function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const dictionary = useSettingsStore.getState().language === 'en' ? en : tr;
  return interpolate(resolve(dictionary, key), params);
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(SLEEP_CHANNEL_ID, {
    name: t('notifications.channelName'),
    importance: Notifications.AndroidImportance.HIGH,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

/**
 * Shows a short priming explanation before the OS permission prompt, since a bare
 * cold prompt with no context leads to more denials than an explained one.
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  if (!existing.canAskAgain) return false;

  const primed = await new Promise<boolean>((resolveAlert) => {
    Alert.alert(t('notifications.primeTitle'), t('notifications.primeMessage'), [
      { text: t('notifications.notNow'), style: 'cancel', onPress: () => resolveAlert(false) },
      { text: t('notifications.continueLabel'), onPress: () => resolveAlert(true) },
    ]);
  });
  if (!primed) return false;

  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}

export async function scheduleSleepNotification(startedAt: string): Promise<string | undefined> {
  if (!useSettingsStore.getState().notificationsEnabled) return undefined;

  const granted = await ensureNotificationPermission();
  if (!granted) return undefined;

  await setupAndroidChannel();

  const startedLabel = new Date(startedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: t('notifications.ongoingTitle'),
      body: t('notifications.ongoingBody', { time: startedLabel }),
      data: { type: 'sleep' },
      sticky: Platform.OS === 'android',
      autoDismiss: false,
      ...(Platform.OS === 'android' ? { channelId: SLEEP_CHANNEL_ID } : null),
    },
    trigger: null,
  });

  return id;
}
