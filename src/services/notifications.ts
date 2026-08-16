import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

const SLEEP_CHANNEL_ID = 'sleep-tracking';

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
    name: 'Uyku takibi',
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

  const primed = await new Promise<boolean>((resolve) => {
    Alert.alert(
      'Uyku süresini takip et',
      'Bebeğiniz uyurken bir bildirim göstereceğiz, böylece uyandığında zamanlayıcıyı hızlıca durdurabilirsiniz.',
      [
        { text: 'Şimdi değil', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Devam et', onPress: () => resolve(true) },
      ]
    );
  });
  if (!primed) return false;

  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}

export async function scheduleSleepNotification(startedAt: string): Promise<string | undefined> {
  const granted = await ensureNotificationPermission();
  if (!granted) return undefined;

  await setupAndroidChannel();

  const startedLabel = new Date(startedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Uyku devam ediyor',
      body: `${startedLabel}'den beri uyuyor · Durdurmak için dokun`,
      data: { type: 'sleep' },
      sticky: Platform.OS === 'android',
      autoDismiss: false,
      ...(Platform.OS === 'android' ? { channelId: SLEEP_CHANNEL_ID } : null),
    },
    trigger: null,
  });

  return id;
}

export async function dismissSleepNotification(notificationId?: string): Promise<void> {
  if (!notificationId) return;
  await Notifications.dismissNotificationAsync(notificationId).catch(() => undefined);
}
