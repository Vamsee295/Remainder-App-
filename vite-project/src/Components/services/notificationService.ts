/**
 * Web Notification Service with Service Worker Support
 * Handles browser notification permissions and scheduling via Service Worker
 */

import type { Reminder } from '../types/reminder.types';

export class NotificationService {
    /**
     * Request notification permissions from the browser
     */
    static async requestPermissions(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission === 'denied') {
            alert('Notification permission was denied. Please enable it in browser settings.');
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    /**
     * Schedule a notification for a reminder using Service Worker
     */
    static async scheduleNotification(reminder: Reminder): Promise<string> {
        const timeUntilReminder = new Date(reminder.reminderDateTime).getTime() - Date.now();

        if (timeUntilReminder < 0) {
            console.warn('Reminder time is in the past');
            return '';
        }

        // Check if Service Worker is available
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;

                // Send message to Service Worker to schedule notification
                registration.active?.postMessage({
                    type: 'SCHEDULE_NOTIFICATION',
                    reminder: reminder
                });

                console.log(`📅 Scheduled notification via Service Worker: ${reminder.title}`);
                return reminder.id;
            } catch (error) {
                console.error('Failed to schedule via Service Worker:', error);
                // Fallback to regular setTimeout
                return this.scheduleWithTimeout(reminder);
            }
        } else {
            // Fallback to regular setTimeout if Service Worker not available
            return this.scheduleWithTimeout(reminder);
        }
    }

    /**
     * Fallback: Schedule using setTimeout (less reliable)
     */
    private static scheduleWithTimeout(reminder: Reminder): string {
        const timeUntilReminder = new Date(reminder.reminderDateTime).getTime() - Date.now();

        const timeoutId = window.setTimeout(() => {
            this.showNotification(reminder);
        }, timeUntilReminder);

        return String(timeoutId);
    }

    /**
     * Show a notification immediately
     */
    private static async showNotification(reminder: Reminder): Promise<void> {
        if (Notification.permission === 'granted') {
            // Try to use Service Worker notification for better persistence
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.ready;
                    await registration.showNotification('🔔 Reminder', {
                        body: reminder.title,
                        icon: '/icon-192.png',
                        badge: '/icon-192.png',
                        tag: reminder.id,
                        requireInteraction: true,
                        data: { reminderId: reminder.id }
                    });
                    return;
                } catch (error) {
                    console.error('Service Worker notification failed:', error);
                }
            }

            // Fallback to regular notification
            const notification = new Notification('🔔 Reminder', {
                body: reminder.title,
                icon: '/icon-192.png',
                tag: reminder.id,
                requireInteraction: true,
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    }

    /**
     * Cancel a scheduled notification
     */
    static async cancelNotification(notificationId: string): Promise<void> {
        if (!notificationId) return;

        // Try to cancel via Service Worker
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                registration.active?.postMessage({
                    type: 'CANCEL_NOTIFICATION',
                    reminderId: notificationId
                });
            } catch (error) {
                console.error('Failed to cancel via Service Worker:', error);
            }
        }

        // Also try to clear timeout if it was a number
        const timeoutId = Number(notificationId);
        if (!isNaN(timeoutId)) {
            window.clearTimeout(timeoutId);
        }
    }

    /**
     * Get current permission status
     */
    static getPermissionStatus(): NotificationPermission {
        return Notification.permission;
    }
}
