# 🔔 Reminder App

A modern, feature-rich Progressive Web App (PWA) for managing reminders with Support for background notifications.

## ✨ Features

- **📱 Progressive Web App** - Install as a standalone app on desktop and mobile
- **🔔 Smart Notifications** - Schedule reminders with Service Worker-powered notifications
- **📂 Category Organization** - Organize reminders by Work, Personal, Shopping, Health, and Other
- **✅ Task Management** - Track active and completed reminders
- **💾 Local Storage** - All data stored securely in your browser
- **🌐 Offline Support** - Works offline with cached resources
- **🎨 Modern UI** - Clean, intuitive interface built with React + TypeScript

## 🚀 Quick Start

```bash
cd vite-project
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 💻 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Vanilla CSS
- **PWA:** Service Worker + Web Notifications API
- **Storage:** LocalStorage

## 📦 Installation as PWA

1. Open the app in your browser
2. Click the install icon (⊕) in the address bar
3. Enjoy the app as a standalone application!

## 🛠️ Project Structure

```
vite-project/
├── src/
│   ├── Components/
│   │   ├── services/       # Business logic & notification handling
│   │   ├── context/        # React context for state management
│   │   ├── ui/             # UI components
│   │   └── utils/          # Helper functions
│   └── main.tsx            # Entry point with Service Worker registration
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── service-worker.js   # Background notification handler
│   └── icon-*.png          # App icons
└── index.html
```

## 📝 How It Works

1. **Create Reminders** - Set title, category, and date/time
2. **Schedule Notifications** - Service Worker schedules browser notifications
3. **Get Notified** - Receive notifications at the scheduled time
4. **Complete Tasks** - Mark reminders as done or delete them

## 🎯 Key Features Explained

### Service Worker Notifications
The app uses Service Workers to provide more reliable notifications compared to standard JavaScript timers. While the browser must remain open, notifications work even when the app is minimized.

### PWA Capabilities
- Installable on any device
- Offline caching for core functionality
- Native app-like experience
- Custom app icons and splash screens

## ⚠️ Limitations

- Browser must be open for notifications (not killed/closed)
- iOS has limited PWA notification support
- For true background notifications, consider a native mobile app

## 📄 License

Free to use and modify.

---

**Made with ❤️ using React + Vite**
