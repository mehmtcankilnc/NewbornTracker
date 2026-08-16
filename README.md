# Bebek Takibi

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-SDK_54-000000?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NativeWind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="NativeWind" />
  <img src="https://img.shields.io/badge/Zustand-5-443E38?style=for-the-badge" alt="Zustand" />
</p>

A simple React Native app for tracking a newborn's poop, piss, feed, and sleep — entirely on-device, with no login and no backend.

> [!NOTE]
> 🍼 **Project Status:** Functional and actively refined. Built as a minimal, local-first tracker — two screens plus a sleep-timer flow, nothing more.

---

## 🛠 Tech Stack

| Domain            | Technology                                                                         |
| :---------------- | :--------------------------------------------------------------------------------- |
| **Framework**     | React Native (Expo)                                                                |
| **Language**      | TypeScript                                                                         |
| **Navigation**    | Expo Router (file-based, headless `Tabs` primitives for a custom floating nav bar) |
| **Styling**       | NativeWind (Tailwind for React Native)                                             |
| **State**         | Zustand, persisted to `@react-native-async-storage/async-storage`                  |
| **Notifications** | `expo-notifications` (local only — no push, no server)                             |
| **Lists**         | `@shopify/flash-list`                                                              |
| **Animations**    | `react-native-reanimated`                                                          |
| **Dates**         | `date-fns` (Turkish locale)                                                        |

No backend, no analytics, no third-party services — every record lives in AsyncStorage on the device.

---

## 🚀 Getting Started

### Prerequisites

Node.js and npm, plus the [Expo Go](https://expo.dev/go) app on your phone (matching **SDK 54**) or a configured Android/iOS emulator.

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

3. **Run the app:**
   ```bash
   npx expo start
   ```
   Scan the QR code with Expo Go, or press `a` / `i` for a connected emulator/simulator.

> [!IMPORTANT]
> No `.env` file or credentials are needed — the app has no backend to configure. Everything runs and persists locally on the device.

---

## 📐 Technical Architecture & Decisions

### 🗂️ Two screens, one flow

- **Ekle (Add)** — a title-free header (date pill + optional baby-name input), four record-type cards, and a "today" stats strip.
- **Kayıtlar (Records)** — day-grouped list with type and date-range filtering, swipe- or long-press-to-delete (with confirmation).
- **Uyku Zamanlayıcısı (Stop Sleep)** — a third screen, reachable only via the sleep card or a notification tap, never part of the tab bar.

### 😴 Sleep tracking via local notification

Starting a sleep record schedules a **local** (not push) notification: non-dismissable/sticky on Android, a best-effort persistent notification on iOS (a platform limitation, not a choice). Tapping it deep-links straight into the stop-sleep screen, which computes and saves the duration.

### 🧭 Custom floating tab bar

The bottom nav isn't the OS-native tab bar — it's built on Expo Router's headless `Tabs`/`TabList`/`TabTrigger` primitives, styled as a floating pill with an animated sliding indicator (`react-native-reanimated`), to match the app's own design language instead of the platform default.

### 🔍 Filtering

Records can be filtered by type (multi-select) and by time period (today / week / month / a custom date range), combined with AND logic, without ever remounting the list — filtering only swaps the data passed to `FlashList`.

---

## 📜 License

Distributed under the MIT License. Built as a personal project for tracking a newborn's day-to-day.
