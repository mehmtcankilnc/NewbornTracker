import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Switch } from '@/components/ui/Switch';
import { useTranslation } from '@/i18n';
import { useRecordsStore } from '@/stores/useRecordsStore';
import { useSettingsStore, type Language } from '@/stores/useSettingsStore';
import { useAppTheme } from '@/theme/useAppTheme';

export default function SettingsScreen() {
  const { t, language, setLanguage } = useTranslation();
  const { colors, isDark, setThemeMode } = useAppTheme();
  const clearRecords = useRecordsStore((s) => s.clearRecords);
  const babyName = useRecordsStore((s) => s.babyName);
  const setBabyName = useRecordsStore((s) => s.setBabyName);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);
  const [nameInput, setNameInput] = useState(babyName);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const languageOptions: { key: Language; label: string }[] = [
    { key: 'tr', label: t('settings.turkish') },
    { key: 'en', label: t('settings.english') },
  ];

  function commitName() {
    setBabyName(nameInput.trim());
  }

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-surface-night" edges={['top', 'left', 'right']}>
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          className="h-9 w-9 rounded-full items-center justify-center bg-surface-elevated dark:bg-surface-elevated-night active:opacity-70">
          <Ionicons name="arrow-back" size={18} color={colors.ink} />
        </Pressable>
        <Text className="text-ink dark:text-ink-night text-base font-bold ml-3">{t('settings.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }}>
        <SectionLabel>{t('settings.babyName')}</SectionLabel>
        <TextInput
          value={nameInput}
          onChangeText={setNameInput}
          onEndEditing={commitName}
          onSubmitEditing={commitName}
          placeholder={t('home.babyNamePlaceholder')}
          placeholderTextColor={colors.muted}
          returnKeyType="done"
          maxLength={30}
          accessibilityLabel={t('home.babyNamePlaceholder')}
          textAlignVertical="center"
          style={{ height: 48, paddingVertical: 0, includeFontPadding: false }}
          className="text-ink dark:text-ink-night text-base font-semibold bg-surface-elevated dark:bg-surface-elevated-night rounded-full px-4 mb-8"
        />

        <SectionLabel>{t('settings.appearance')}</SectionLabel>
        <ToggleRow
          label={t('settings.darkModeToggle')}
          value={isDark}
          onValueChange={(next) => setThemeMode(next ? 'dark' : 'light')}
        />

        <SectionLabel>{t('settings.notifications')}</SectionLabel>
        <ToggleRow
          label={t('settings.appNotifications')}
          hint={t('settings.appNotificationsHint')}
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />

        <SectionLabel>{t('settings.language')}</SectionLabel>
        <View className="gap-2 mb-8">
          {languageOptions.map((option) => (
            <OptionRow
              key={option.key}
              label={option.label}
              icon="language-outline"
              active={language === option.key}
              onPress={() => setLanguage(option.key)}
            />
          ))}
        </View>

        <SectionLabel>{t('settings.data')}</SectionLabel>
        <Pressable
          onPress={() => setConfirmVisible(true)}
          accessibilityRole="button"
          accessibilityLabel={t('settings.deleteAllRecords')}
          className="min-h-[48px] rounded-full flex-row items-center gap-2 px-4 bg-surface-elevated dark:bg-surface-elevated-night active:opacity-70">
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text className="text-base font-semibold" style={{ color: colors.danger }}>
            {t('settings.deleteAllRecords')}
          </Text>
        </Pressable>
      </ScrollView>

      <ConfirmModal
        visible={confirmVisible}
        title={t('settings.deleteConfirmTitle')}
        message={t('settings.deleteConfirmMessage')}
        confirmLabel={t('settings.deleteConfirmButton')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => {
          clearRecords();
          setConfirmVisible(false);
        }}
        onCancel={() => setConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}

function SectionLabel({ children }: { children: string }) {
  const { language } = useTranslation();

  // Not using the `uppercase` CSS class: Android's text-transform respects the
  // *device* locale, not our in-app language setting, so it can uppercase wrong
  // (e.g. Turkish-locale phone + English app -> dotted "İ"). Plain JS
  // toUpperCase() has the opposite bug: it always uses the locale-independent
  // Unicode mapping, so Turkish "dil" -> "DIL" (dotless I) instead of "DİL".
  // toLocaleUpperCase(<app language>) follows whichever language the user picked.
  return (
    <Text className="text-muted dark:text-muted-night text-xs font-semibold mb-2">
      {children.toLocaleUpperCase(language === 'tr' ? 'tr' : 'en')}
    </Text>
  );
}

interface ToggleRowProps {
  label: string;
  hint?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function ToggleRow({ label, hint, value, onValueChange }: ToggleRowProps) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center justify-between rounded-full px-4 min-h-[48px] bg-surface-elevated dark:bg-surface-elevated-night mb-8">
      <View className="flex-1 pr-3">
        <Text className="text-ink dark:text-ink-night text-base">{label}</Text>
        {hint ? (
          <Text className="text-muted dark:text-muted-night text-xs mt-0.5">{hint}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        onColor={colors.primary}
        offColor={colors.border}
        thumbColor={colors.white}
        accessibilityLabel={label}
      />
    </View>
  );
}

interface OptionRowProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}

function OptionRow({ label, icon, active, onPress }: OptionRowProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: active }}
      accessibilityLabel={label}
      className={`min-h-[48px] rounded-full flex-row items-center justify-between px-4 active:opacity-70 ${
        active ? 'bg-primary dark:bg-primary-night' : 'bg-surface-elevated dark:bg-surface-elevated-night'
      }`}>
      <View className="flex-row items-center gap-2">
        <Ionicons name={icon} size={16} color={active ? colors.white : colors.muted} />
        <Text
          className={`text-base ${active ? 'text-white font-semibold' : 'text-ink dark:text-ink-night'}`}>
          {label}
        </Text>
      </View>
      {active && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
    </Pressable>
  );
}
