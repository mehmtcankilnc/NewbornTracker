export interface Translations {
  common: {
    all: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
  };
  recordTypes: {
    poop: { label: string; question: string };
    piss: { label: string; question: string };
    feed: { label: string; question: string };
    sleep: { label: string; question: string };
  };
  feedSubtypes: {
    breastfeeding: string;
    extraBreastMilk: string;
    extraFormula: string;
  };
  time: {
    now: string;
    minutesAgo: string;
    hoursShort: string;
    minutesShort: string;
    hoursCompact: string;
    minutesCompact: string;
    justNow: string;
    agoSuffix: string;
    todayDateLabel: string;
    today: string;
    yesterday: string;
  };
  home: {
    babyNamePlaceholder: string;
    greetingNamed: string;
    greetingAnon: string;
    subtitle: string;
    sleeping: string;
    sleepingSince: string;
    savedToast: string;
    feedSavedToast: string;
    settingsLabel: string;
  };
  records: {
    periodAll: string;
    periodToday: string;
    periodWeek: string;
    periodMonth: string;
    periodCustom: string;
    emptyTitle: string;
    emptyTitleFiltered: string;
    emptySubtitleNoRecords: string;
    emptySubtitleFiltered: string;
    goHome: string;
    recordCount: string;
    other: string;
    start: string;
    end: string;
    select: string;
    applyRange: string;
    cancelRange: string;
  };
  timePicker: {
    customLabel: string;
    customSelected: string;
    confirm: string;
    cancel: string;
    pickTimeTitle: string;
    pickerConfirm: string;
    pickerCancel: string;
  };
  feedDetails: {
    title: string;
    amountLabel: string;
    amountPlaceholder: string;
    save: string;
    cancel: string;
  };
  recordDetails: {
    editTitle: string;
    date: string;
    time: string;
    pickDateTitle: string;
    pickTimeTitle: string;
    pickerConfirm: string;
    pickerCancel: string;
    save: string;
    cancel: string;
  };
  deleteRecord: {
    title: string;
    message: string;
    confirm: string;
  };
  todayStats: {
    title: string;
  };
  stopSleep: {
    back: string;
    title: string;
    noActiveSleep: string;
    alreadyStopped: string;
    goHome: string;
    sleepingSince: string;
    stop: string;
  };
  tabs: {
    home: string;
    records: string;
  };
  notifications: {
    primeTitle: string;
    primeMessage: string;
    notNow: string;
    continueLabel: string;
    channelName: string;
    ongoingTitle: string;
    ongoingBody: string;
  };
  settings: {
    title: string;
    babyName: string;
    appearance: string;
    light: string;
    dark: string;
    system: string;
    darkModeToggle: string;
    language: string;
    turkish: string;
    english: string;
    notifications: string;
    appNotifications: string;
    appNotificationsHint: string;
    data: string;
    deleteAllRecords: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    deleteConfirmButton: string;
    deletedToast: string;
  };
  widget: {
    greetingNamed: string;
    greetingAnon: string;
    todaySummary: string;
    noRecord: string;
    lastRecord: string;
    sleepEnded: string;
    sleepingBadge: string;
    refreshLabel: string;
    addLabel: string;
    stopLabel: string;
  };
}

export const tr: Translations = {
  common: {
    all: 'Tümü',
    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'Düzenle',
    back: 'Geri',
  },
  recordTypes: {
    poop: { label: 'Kaka', question: 'Kaka ne zaman oldu?' },
    piss: { label: 'Çiş', question: 'Çiş ne zaman oldu?' },
    feed: { label: 'Mama', question: 'Mama ne zaman verildi?' },
    sleep: { label: 'Uyku', question: 'Uyku ne zaman başladı?' },
  },
  feedSubtypes: {
    breastfeeding: 'Süt emme',
    extraBreastMilk: 'Ekstra anne sütü',
    extraFormula: 'Ekstra mama',
  },
  time: {
    now: 'Şimdi',
    minutesAgo: '{{n}} dakika önce',
    hoursShort: 'sa',
    minutesShort: 'dk',
    hoursCompact: 's',
    minutesCompact: 'dk',
    justNow: 'az önce',
    agoSuffix: 'önce',
    todayDateLabel: 'Bugün, {{date}}',
    today: 'Bugün',
    yesterday: 'Dün',
  },
  home: {
    babyNamePlaceholder: 'Bebek adı',
    greetingNamed: 'Selam, {{name}}! 👶',
    greetingAnon: 'Selam! 👋',
    subtitle: 'Hemen bir kayıt ekleyerek başla',
    sleeping: 'Uyuyor…',
    sleepingSince: "{{time}}'den beri · Durdurmak için dokun",
    savedToast: '{{label}} kaydedildi · {{time}}',
    feedSavedToast: 'Mama kaydedildi · {{time}}',
    settingsLabel: 'Ayarlar',
  },
  records: {
    periodAll: 'Tümü',
    periodToday: 'Bugün',
    periodWeek: 'Hafta',
    periodMonth: 'Ay',
    periodCustom: 'Özel',
    emptyTitle: 'Henüz kayıt yok',
    emptyTitleFiltered: 'Bu filtrelere uygun kayıt yok',
    emptySubtitleNoRecords:
      'Ana Sayfa sekmesinden kaka, çiş, mama veya uyku kaydı oluşturduğunda burada görünecek.',
    emptySubtitleFiltered: 'Farklı bir filtre deneyin veya filtreleri temizleyin.',
    goHome: "Ana Sayfa'ya git",
    recordCount: '{{n}} kayıt',
    other: 'diğer',
    start: 'Başlangıç',
    end: 'Bitiş',
    select: 'Seç',
    applyRange: 'Uygula',
    cancelRange: 'Vazgeç',
  },
  timePicker: {
    customLabel: 'Özel…',
    customSelected: 'Özel: {{time}}',
    confirm: 'Onayla',
    cancel: 'İptal',
    pickTimeTitle: 'Saat seç',
    pickerConfirm: 'Seç',
    pickerCancel: 'Vazgeç',
  },
  feedDetails: {
    title: 'Mama türü',
    amountLabel: 'Miktar (ml, opsiyonel)',
    amountPlaceholder: 'Örn. 120',
    save: 'Kaydet',
    cancel: 'İptal',
  },
  recordDetails: {
    editTitle: '{{label}} kaydını düzenle',
    date: 'Tarih',
    time: 'Saat',
    pickDateTitle: 'Tarih seç',
    pickTimeTitle: 'Saat seç',
    pickerConfirm: 'Seç',
    pickerCancel: 'Vazgeç',
    save: 'Kaydet',
    cancel: 'İptal',
  },
  deleteRecord: {
    title: 'Kayıt silinsin mi?',
    message: 'Bu {{label}} kaydı silinecek.',
    confirm: 'Sil',
  },
  todayStats: {
    title: 'Bugün',
  },
  stopSleep: {
    back: 'Geri',
    title: 'Uyku Zamanlayıcısı',
    noActiveSleep: 'Devam eden uyku yok',
    alreadyStopped: 'Bu uyku kaydı zaten durduruldu.',
    goHome: "Ana Sayfa'ya dön",
    sleepingSince: "{{time}}'den beri uyuyor",
    stop: 'Uykuyu durdur',
  },
  tabs: {
    home: 'Ana Sayfa',
    records: 'Kayıtlar',
  },
  notifications: {
    primeTitle: 'Uyku süresini takip et',
    primeMessage:
      'Bebeğiniz uyurken bir bildirim göstereceğiz, böylece uyandığında zamanlayıcıyı hızlıca durdurabilirsiniz.',
    notNow: 'Şimdi değil',
    continueLabel: 'Devam et',
    channelName: 'Uyku takibi',
    ongoingTitle: 'Uyku devam ediyor',
    ongoingBody: "{{time}}'den beri uyuyor · Durdurmak için dokun",
  },
  settings: {
    title: 'Ayarlar',
    babyName: 'Bebek adı',
    appearance: 'Görünüm',
    light: 'Açık',
    dark: 'Koyu',
    system: 'Sistem',
    darkModeToggle: 'Koyu tema',
    language: 'Dil',
    turkish: 'Türkçe',
    english: 'English',
    notifications: 'Bildirimler',
    appNotifications: 'Uygulama bildirimi',
    appNotificationsHint: 'Uyku takibi sırasında bildirim gösterilsin',
    data: 'Veri',
    deleteAllRecords: 'Tüm kayıtları sil',
    deleteConfirmTitle: 'Tüm kayıtlar silinsin mi?',
    deleteConfirmMessage:
      'Kaka, çiş, mama ve uyku kayıtlarının tamamı silinecek. Bebek adı ve ayarların kalır. Bu işlem geri alınamaz.',
    deleteConfirmButton: 'Tümünü sil',
    deletedToast: 'Tüm kayıtlar silindi',
  },
  widget: {
    greetingNamed: 'Selam, {{name}}! 👶',
    greetingAnon: 'Selam! 👋',
    todaySummary: 'Bugün: {{feed}} mama · {{piss}} çiş · {{poop}} kaka · {{sleep}}',
    noRecord: '{{label}} kaydı yok',
    lastRecord: '{{label}} • {{elapsed}}',
    sleepEnded: 'Uyku • {{duration}} · {{elapsed}} bitti',
    sleepingBadge: '😴 Uykuda • {{elapsed}}',
    refreshLabel: "Widget'ı yenile",
    addLabel: '{{label}} ekle',
    stopLabel: 'Durdur',
  },
};

export const en: Translations = {
  common: {
    all: 'All',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
  },
  recordTypes: {
    poop: { label: 'Poop', question: 'When did the poop happen?' },
    piss: { label: 'Pee', question: 'When did the pee happen?' },
    feed: { label: 'Feed', question: 'When was the feed?' },
    sleep: { label: 'Sleep', question: 'When did sleep start?' },
  },
  feedSubtypes: {
    breastfeeding: 'Breastfeeding',
    extraBreastMilk: 'Extra breast milk',
    extraFormula: 'Extra formula',
  },
  time: {
    now: 'Now',
    minutesAgo: '{{n}} minutes ago',
    hoursShort: 'h',
    minutesShort: 'min',
    hoursCompact: 'h',
    minutesCompact: 'm',
    justNow: 'just now',
    agoSuffix: 'ago',
    todayDateLabel: 'Today, {{date}}',
    today: 'Today',
    yesterday: 'Yesterday',
  },
  home: {
    babyNamePlaceholder: "Baby's name",
    greetingNamed: 'Hi, {{name}}! 👶',
    greetingAnon: 'Hi there! 👋',
    subtitle: 'Start by adding a record',
    sleeping: 'Sleeping…',
    sleepingSince: 'Since {{time}} · Tap to stop',
    savedToast: '{{label}} saved · {{time}}',
    feedSavedToast: 'Feed saved · {{time}}',
    settingsLabel: 'Settings',
  },
  records: {
    periodAll: 'All',
    periodToday: 'Today',
    periodWeek: 'Week',
    periodMonth: 'Month',
    periodCustom: 'Custom',
    emptyTitle: 'No records yet',
    emptyTitleFiltered: 'No records match these filters',
    emptySubtitleNoRecords: "It'll show up here once you log a poop, pee, feed, or sleep from Home.",
    emptySubtitleFiltered: 'Try a different filter or clear them.',
    goHome: 'Go to Home',
    recordCount: '{{n}} records',
    other: 'other',
    start: 'Start',
    end: 'End',
    select: 'Select',
    applyRange: 'Apply',
    cancelRange: 'Cancel',
  },
  timePicker: {
    customLabel: 'Custom…',
    customSelected: 'Custom: {{time}}',
    confirm: 'Confirm',
    cancel: 'Cancel',
    pickTimeTitle: 'Pick a time',
    pickerConfirm: 'Select',
    pickerCancel: 'Cancel',
  },
  feedDetails: {
    title: 'Feed type',
    amountLabel: 'Amount (ml, optional)',
    amountPlaceholder: 'e.g. 120',
    save: 'Save',
    cancel: 'Cancel',
  },
  recordDetails: {
    editTitle: 'Edit {{label}} record',
    date: 'Date',
    time: 'Time',
    pickDateTitle: 'Pick a date',
    pickTimeTitle: 'Pick a time',
    pickerConfirm: 'Select',
    pickerCancel: 'Cancel',
    save: 'Save',
    cancel: 'Cancel',
  },
  deleteRecord: {
    title: 'Delete this record?',
    message: 'This {{label}} record will be deleted.',
    confirm: 'Delete',
  },
  todayStats: {
    title: 'Today',
  },
  stopSleep: {
    back: 'Back',
    title: 'Sleep Timer',
    noActiveSleep: 'No sleep in progress',
    alreadyStopped: 'This sleep record was already stopped.',
    goHome: 'Back to Home',
    sleepingSince: 'Sleeping since {{time}}',
    stop: 'Stop sleep',
  },
  tabs: {
    home: 'Home',
    records: 'Records',
  },
  notifications: {
    primeTitle: 'Track sleep duration',
    primeMessage:
      "We'll show a notification while your baby sleeps, so you can quickly stop the timer when they wake up.",
    notNow: 'Not now',
    continueLabel: 'Continue',
    channelName: 'Sleep tracking',
    ongoingTitle: 'Sleep in progress',
    ongoingBody: 'Sleeping since {{time}} · Tap to stop',
  },
  settings: {
    title: 'Settings',
    babyName: "Baby's name",
    appearance: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    darkModeToggle: 'Dark mode',
    language: 'Language',
    turkish: 'Türkçe',
    english: 'English',
    notifications: 'Notifications',
    appNotifications: 'App notifications',
    appNotificationsHint: 'Show a notification while tracking sleep',
    data: 'Data',
    deleteAllRecords: 'Delete all records',
    deleteConfirmTitle: 'Delete all records?',
    deleteConfirmMessage:
      "All poop, pee, feed, and sleep records will be deleted. The baby's name and settings are kept. This can't be undone.",
    deleteConfirmButton: 'Delete all',
    deletedToast: 'All records deleted',
  },
  widget: {
    greetingNamed: 'Hi, {{name}}! 👶',
    greetingAnon: 'Hi there! 👋',
    todaySummary: 'Today: {{feed}} feeds · {{piss}} pees · {{poop}} poops · {{sleep}}',
    noRecord: 'No {{label}} yet',
    lastRecord: '{{label}} • {{elapsed}}',
    sleepEnded: 'Sleep • {{duration}} · ended {{elapsed}}',
    sleepingBadge: '😴 Sleeping • {{elapsed}}',
    refreshLabel: 'Refresh widget',
    addLabel: 'Add {{label}}',
    stopLabel: 'Stop',
  },
};
