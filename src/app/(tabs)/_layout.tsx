import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarRow, TabButton, TabDivider } from '@/components/navigation/FloatingTabBar';
import { useTranslation } from '@/i18n';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

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
            <TabButton icon="home" label={t('tabs.home')} />
          </TabTrigger>
          <TabDivider />
          <TabTrigger name="records" href="/records" asChild>
            <TabButton icon="albums" label={t('tabs.records')} />
          </TabTrigger>
        </TabBarRow>
      </TabList>
    </Tabs>
  );
}
