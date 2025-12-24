/**
 * Reminder Service
 * Core business logic for reminder CRUD operations
 */

import type { Reminder, ReminderFormData } from '../types/reminder.types';
import { StorageService } from './storageService';
import { NotificationService } from './notificationService';
import { generateUUID } from '../utils/uuid';

export class ReminderService {
    /**
     * Create a new reminder
     */
    static async createReminder(
        data: ReminderFormData,
        existingReminders: Reminder[]
    ): Promise<Reminder> {
        const newReminder: Reminder = {
            id: generateUUID(),
            title: data.title,
            category: data.category,
            reminderDateTime: data.reminderDateTime.toISOString(),
            isCompleted: false,
            createdAt: new Date().toISOString(),
        };

        // Schedule notification
        const notificationId = await NotificationService.scheduleNotification(newReminder);
        if (notificationId) {
            newReminder.notificationId = notificationId;
        }

        // Save to storage
        const updatedReminders = [...existingReminders, newReminder];
        StorageService.saveReminders(updatedReminders);

        return newReminder;
    }

    /**
     * Complete a reminder
     */
    static async completeReminder(
        id: string,
        reminders: Reminder[]
    ): Promise<Reminder[]> {
        const updatedReminders = reminders.map((reminder) => {
            if (reminder.id === id) {
                // Cancel notification if exists
                if (reminder.notificationId) {
                    NotificationService.cancelNotification(reminder.notificationId);
                }

                return {
                    ...reminder,
                    isCompleted: true,
                    completedAt: new Date().toISOString(),
                };
            }
            return reminder;
        });

        StorageService.saveReminders(updatedReminders);
        return updatedReminders;
    }

    /**
     * Delete a reminder
     */
    static async deleteReminder(
        id: string,
        reminders: Reminder[]
    ): Promise<Reminder[]> {
        const reminderToDelete = reminders.find((r) => r.id === id);

        // Cancel notification if exists
        if (reminderToDelete?.notificationId) {
            NotificationService.cancelNotification(reminderToDelete.notificationId);
        }

        const updatedReminders = reminders.filter((r) => r.id !== id);
        StorageService.saveReminders(updatedReminders);

        return updatedReminders;
    }

    /**
     * Get active reminders
     */
    static getActiveReminders(reminders: Reminder[]): Reminder[] {
        return reminders
            .filter((r) => !r.isCompleted)
            .sort((a, b) =>
                new Date(a.reminderDateTime).getTime() - new Date(b.reminderDateTime).getTime()
            );
    }

    /**
     * Get completed reminders
     */
    static getCompletedReminders(reminders: Reminder[]): Reminder[] {
        return reminders
            .filter((r) => r.isCompleted)
            .sort((a, b) =>
                new Date(b.completedAt || b.createdAt).getTime() -
                new Date(a.completedAt || a.createdAt).getTime()
            );
    }
}
