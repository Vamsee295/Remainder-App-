/**
 * ReminderForm Component
 * Form to create new reminders
 */

import React, { useState } from 'react';
import { ReminderCategory, type ReminderFormData } from '../types/reminder.types';
import { formatDateTimeForInput } from '../utils/dateUtils';
import './ReminderForm.css';

interface ReminderFormProps {
    onSubmit: (data: ReminderFormData) => Promise<void>;
    onCancel: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<ReminderCategory>(ReminderCategory.PERSONAL);
    const [dateTime, setDateTime] = useState(
        formatDateTimeForInput(new Date(Date.now() + 60 * 60 * 1000)) // 1 hour from now
    );
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Please enter a reminder title');
            return;
        }

        const selectedDate = new Date(dateTime);
        if (selectedDate <= new Date()) {
            alert('Please select a future date and time');
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit({
                title: title.trim(),
                category,
                reminderDateTime: selectedDate,
            });

            // Reset form
            setTitle('');
            setCategory(ReminderCategory.PERSONAL);
            setDateTime(formatDateTimeForInput(new Date(Date.now() + 60 * 60 * 1000)));
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="reminder-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Add New Reminder</h2>

            <div className="form-group">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                    id="title"
                    type="text"
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter reminder title"
                    maxLength={200}
                    disabled={submitting}
                    autoFocus
                />
            </div>

            <div className="form-group">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                    id="category"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ReminderCategory)}
                    disabled={submitting}
                >
                    <option value={ReminderCategory.PERSONAL}>Personal</option>
                    <option value={ReminderCategory.JOB}>Job</option>
                    <option value={ReminderCategory.STOCK}>Stock</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="datetime" className="form-label">Date & Time</label>
                <input
                    id="datetime"
                    type="datetime-local"
                    className="form-input"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    disabled={submitting}
                />
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                >
                    {submitting ? 'Creating...' : 'Create Reminder'}
                </button>
            </div>
        </form>
    );
};

export default ReminderForm;
