# Bebek Takibi

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-SDK_54-000000?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NativeWind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="NativeWind" />
  <img src="https://img.shields.io/badge/Zustand-5-443E38?style=for-the-badge" alt="Zustand" />
</p>

A simple React Native app for tracking a newborn's poop, piss, feed, and sleep — entirely on-device, with no login and no backend. Includes an Android home-screen widget for quick-add and at-a-glance status without opening the app.

> [!NOTE]
> 🍼 **Project Status:** Functional and actively refined. Built as a minimal, local-first tracker — two screens, a sleep-timer flow, and a home-screen widget, nothing more.

---

## 🛠 Tech Stack

| Domain             | Technology                                                                                |
| :----------------- | :---------------------------------------------------------------------------------------- |
| **Framework**      | React Native (Expo, dev-client build — not compatible with Expo Go, see below)            |
| **Language**       | TypeScript                                                                                |
| **Navigation**     | Expo Router (file-based, headless `Tabs` primitives for a custom floating nav bar)        |
| **Styling**        | NativeWind (Tailwind for React Native)                                                    |
| **State**          | Zustand, persisted to `@react-native-async-storage/async-storage`                         |
| **Notifications**  | `expo-notifications` (local only — no push, no server)                                    |
| **Lists**          | `@shopify/flash-list`                                                                     |
| **Animations**     | `react-native-reanimated`, `react-native-gesture-handler` (drag-to-dismiss bottom sheets) |
| **Dates**          | `date-fns` (Turkish locale), `react-native-date-picker` (native date/time picker modal)   |
| **Android Widget** | `react-native-android-widget` (home-screen widget, headless JS task handler)              |

No backend, no analytics, no third-party services — every record lives in AsyncStorage on the device.

---

## 🚀 Getting Started

### Prerequisites

Node.js and npm, plus an Android/iOS device or emulator with a **development build** installed.

> [!WARNING]
> This project can **not** run inside the plain Expo Go app. `react-native-android-widget` and `react-native-date-picker` are native modules that require a custom dev client build.

### Installation & Setup

1. **Clone the repository and enter the project folder:**

   ```bash
   git clone https://github.com/mehmtcankilnc/NewbornTracker.git
   cd BebekTakibi
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build and install a dev client** (only needed once, or after native deps/config change):

   ```bash
   npx expo run:android   # or: npx expo run:ios
   ```

4. **Start Metro and run the app:**
   ```bash
   npx expo start --dev-client
   ```
   Open the already-installed dev client on your device/emulator — it connects to Metro automatically.

> [!IMPORTANT]
> No `.env` file or credentials are needed — the app has no backend to configure. Everything runs and persists locally on the device.

---

## 📐 Technical Architecture & Decisions

### 🗂️ Two screens, one flow

- **Ekle (Add)** — a title-free header (date pill + optional baby-name input), four record-type cards, and a "today" stats strip. Picking "Mama" additionally opens a bottom sheet to select one or more feed subtypes (breastfeeding / extra breast milk / extra formula) and an optional amount in ml.
- **Kayıtlar (Records)** — day-grouped list, with type and date-range filtering (Tümü / Bugün / Hafta / Ay / Özel), swipe- or long-press-to-delete (with confirmation), and tap-to-edit (date, time, and — for feed — subtypes/amount) via a shared draggable bottom sheet. When a type filter is active, each day header shows a record count; filtering to feed-only shows a per-subtype breakdown instead. The list shows a shimmer skeleton instead of blocking navigation while the persisted store rehydrates.
- **Uyku Zamanlayıcısı (Stop Sleep)** — a third screen, reachable only via the sleep card or a notification tap, never part of the tab bar.

### 🏠 Android home-screen widget

A `react-native-android-widget` widget (`src/widgets/`) shows a greeting, a "today" summary line, the last event per type, and one-tap quick-add buttons (mama/çiş/kaka + start/stop sleep) — all without opening the app. It runs as a headless JS task (`widget-task-handler.tsx`) that reads/writes the same AsyncStorage key the Zustand store persists to (`widgetStorage.ts`), so the app and widget always agree on data without any bridging API. The main app pushes a manual refresh to any placed widget after every mutation (`syncWidget.tsx`); the widget also has its own ↻ button to force a redraw on demand. Widget dimensions/resize limits are configured in `app.json` under the `react-native-android-widget` plugin entry (`minWidth`/`minHeight`/`maxResizeWidth`/`maxResizeHeight`, in `dp` — not cell counts).

### 😴 Sleep tracking via local notification

Starting a sleep record schedules a **local** (not push) notification: non-dismissable/sticky on Android, a best-effort persistent notification on iOS (a platform limitation, not a choice). Tapping it deep-links straight into the stop-sleep screen, which computes and saves the duration. Sleep can also be started/stopped directly from the widget, which skips the notification (not practical from a headless JS context).

### 🧭 Custom floating tab bar

The bottom nav isn't the OS-native tab bar — it's built on Expo Router's headless `Tabs`/`TabList`/`TabTrigger` primitives, styled as a floating pill with an animated sliding indicator (`react-native-reanimated`), to match the app's own design language instead of the platform default. The active tab's icon/label use the app's primary accent color.

### 🔍 Filtering

Records can be filtered by type (multi-select) and by time period (today / week / month / a custom date range), combined with AND logic, without ever remounting the list — filtering only swaps the data passed to `FlashList`.

### 📄 Shared bottom sheet

All modal sheets (time picker, feed-detail picker, record editor, confirm dialog) share one `Sheet` component (`src/components/ui/Sheet.tsx`): backdrop, keyboard-safe padding, tap-empty-area-to-dismiss-keyboard, and a drag handle for swipe-down-to-close — implemented with `react-native-gesture-handler` + `react-native-reanimated`.

---

## 📜 License

Distributed under the MIT License. Built as a personal project for tracking a newborn's day-to-day.
