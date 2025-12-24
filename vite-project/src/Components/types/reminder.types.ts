/**
 * Reminder Type Definitions
 * Core data models for the reminder application
 */

/**
 * Reminder category enum
 */
export enum ReminderCategory {
    JOB = 'job',
    STOCK = 'stock',
    PERSONAL = 'personal',
}

/**
 * Core reminder data model
 */
export interface Reminder {
    id: string;                          // UUID v4
    title: string;                       // Reminder title
    category: ReminderCategory;          // Category type
    reminderDateTime: string;            // ISO 8601 format
    isCompleted: boolean;                // Completion status
    createdAt: string;                   // ISO 8601 format
    completedAt?: string;                // ISO 8601 format (optional)
    notificationId?: string;             // Web Notification identifier
}

/**
 * Form data for creating/editing reminders
 */
export interface ReminderFormData {
    title: string;
    category: ReminderCategory;
    reminderDateTime: Date;
}

/**
 * Reminder statistics
 */
export interface ReminderStats {
    totalActive: number;
    totalCompleted: number;
    byCategory: Record<ReminderCategory, number>;
}
