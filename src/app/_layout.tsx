import '@/global.css';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { setupAndroidChannel } from '@/services/notifications';
import { useRecordsStore } from '@/stores/useRecordsStore';

SplashScreen.preventAutoHideAsync();

function routeIfSleepNotification(response: Notifications.NotificationResponse | null) {
  if (response?.notification.request.content.data?.type === 'sleep') {
    router.push('/stop-sleep');
  }
}

export default function RootLayout() {
  useEffect(() => {
    setupAndroidChannel();

    Notifications.getLastNotificationResponseAsync().then(routeIfSleepNotification);

    const subscription = Notifications.addNotificationResponseReceivedListener(
      routeIfSleepNotification
    );

    // Widget quick-add writes directly to AsyncStorage, so pick up those changes when returning to the app.
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') useRecordsStore.persist.rehydrate();
    });

    return () => {
      subscription.remove();
      appStateSubscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <StatusBar style="dark" translucent />
        <View style={{ flex: 1 }} onLayout={() => SplashScreen.hideAsync()}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="stop-sleep" options={{ presentation: 'modal' }} />
          </Stack>
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
