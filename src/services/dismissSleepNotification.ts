import * as Notifications from 'expo-notifications';

/**
 * Split out of notifications.ts (which pulls in useSettingsStore for translated
 * notification text) so widgetStorage.ts can dismiss a notification without
 * creating a require cycle: widgetStorage -> notifications -> useSettingsStore ->
 * syncWidget -> widgetContent -> widgetStorage.
 */
export async function dismissSleepNotification(notificationId?: string): Promise<void> {
  if (!notificationId) return;
  await Notifications.dismissNotificationAsync(notificationId).catch(() => undefined);
}
