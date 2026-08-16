import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarRow, TabButton, TabDivider } from '@/components/navigation/FloatingTabBar';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList
        asChild
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: Math.max(insets.bottom, 16),
        }}>
        <TabBarRow>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon="home" label="Ana Sayfa" />
          </TabTrigger>
          <TabDivider />
          <TabTrigger name="records" href="/records" asChild>
            <TabButton icon="albums" label="Kayıtlar" />
          </TabTrigger>
        </TabBarRow>
      </TabList>
    </Tabs>
  );
}
