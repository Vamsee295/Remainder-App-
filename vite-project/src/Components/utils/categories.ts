/**
 * Category Configuration
 */

import { ReminderCategory } from '../types/reminder.types';

export interface CategoryConfig {
    label: string;
    color: string;
}

export const CATEGORY_CONFIG: Record<ReminderCategory, CategoryConfig> = {
    [ReminderCategory.JOB]: { label: 'Job', color: '#4CAF50' },
    [ReminderCategory.STOCK]: { label: 'Stock', color: '#2196F3' },
    [ReminderCategory.PERSONAL]: { label: 'Personal', color: '#FF9800' },
};
