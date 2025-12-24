/**
 * Service Worker for Reminder App PWA
 * Handles background notifications and offline caching
 */

const CACHE_NAME = 'reminder-app-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Store scheduled reminders in memory
const scheduledReminders = new Map();

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
        const { reminder } = event.data;
        scheduleNotification(reminder);
    } else if (event.data && event.data.type === 'CANCEL_NOTIFICATION') {
        const { reminderId } = event.data;
        cancelScheduledNotification(reminderId);
    }
});

// Schedule a notification
function scheduleNotification(reminder) {
    const now = Date.now();
    const reminderTime = new Date(reminder.reminderDateTime).getTime();
    const delay = reminderTime - now;

    if (delay > 0) {
        const timeoutId = setTimeout(() => {
            showNotification(reminder);
            scheduledReminders.delete(reminder.id);
        }, delay);

        scheduledReminders.set(reminder.id, timeoutId);
        console.log(`Scheduled notification for reminder: ${reminder.title} in ${delay}ms`);
    } else {
        console.warn('Reminder time is in the past:', reminder.title);
    }
}

// Cancel a scheduled notification
function cancelScheduledNotification(reminderId) {
    if (scheduledReminders.has(reminderId)) {
        clearTimeout(scheduledReminders.get(reminderId));
        scheduledReminders.delete(reminderId);
        console.log(`Cancelled notification for reminder: ${reminderId}`);
    }
}

// Show notification
function showNotification(reminder) {
    const title = '🔔 Reminder';
    const options = {
        body: reminder.title,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: reminder.id,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        data: {
            reminderId: reminder.id,
            url: '/'
        }
    };

    self.registration.showNotification(title, options);
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // If a window is already open, focus it
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Otherwise, open a new window
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});
