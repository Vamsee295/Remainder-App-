/**
 * ReminderCard Component
 * Individual reminder item with checkbox
 */

import React from 'react';
import type { Reminder } from '../types/reminder.types';
import { formatDate, formatTime } from '../utils/dateUtils';
import CategoryBadge from './CategoryBadge';
import './ReminderCard.css';

interface ReminderCardProps {
    reminder: Reminder;
    onComplete?: (id: string) => void;
    onDelete?: (id: string) => void;
    showCheckbox?: boolean;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
    reminder,
    onComplete,
    onDelete,
    showCheckbox = true
}) => {
    const handleCheckboxClick = () => {
        if (onComplete && !reminder.isCompleted) {
            onComplete(reminder.id);
        }
    };

    const handleDeleteClick = () => {
        if (onDelete && window.confirm('Are you sure you want to delete this reminder?')) {
            onDelete(reminder.id);
        }
    };

    return (
        <div className="reminder-card">
            {/* Checkbox */}
            {showCheckbox && (
                <button
                    className="checkbox"
                    onClick={handleCheckboxClick}
                    disabled={reminder.isCompleted}
                    aria-label={reminder.isCompleted ? 'Completed' : 'Mark as complete'}
                >
                    <div className={`checkbox-inner ${reminder.isCompleted ? 'checked' : ''}`} />
                </button>
            )}

            {/* Content */}
            <div className="reminder-content">
                <h3 className="reminder-title">{reminder.title}</h3>

                <div className="reminder-metadata">
                    <CategoryBadge category={reminder.category} />
                    <span className="reminder-datetime">
                        {formatDate(reminder.reminderDateTime)} • {formatTime(reminder.reminderDateTime)}
                    </span>
                </div>
            </div>

            {/* Delete button */}
            {onDelete && (
                <button
                    className="delete-button"
                    onClick={handleDeleteClick}
                    aria-label="Delete reminder"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default ReminderCard;
