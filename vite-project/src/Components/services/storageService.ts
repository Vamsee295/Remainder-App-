/**
 * LocalStorage Service
 * Handles all data persistence operations
 */

import type { Reminder } from '../types/reminder.types';
import { STORAGE_KEYS } from '../constants/storage';

export class StorageService {
    /**
     * Save all reminders to localStorage
     */
    static saveReminders(reminders: Reminder[]): void {
        try {
            const jsonValue = JSON.stringify(reminders);
            localStorage.setItem(STORAGE_KEYS.REMINDERS, jsonValue);
        } catch (error) {
            console.error('Failed to save reminders:', error);
            throw new Error('Storage write failed');
        }
    }

    /**
     * Load all reminders from localStorage
     */
    static loadReminders(): Reminder[] {
        try {
            const jsonValue = localStorage.getItem(STORAGE_KEYS.REMINDERS);
            return jsonValue ? JSON.parse(jsonValue) : [];
        } catch (error) {
            console.error('Failed to load reminders:', error);
            return [];
        }
    }

    /**
     * Clear all stored data (for debugging)
     */
    static clearAll(): void {
        localStorage.clear();
    }
}
