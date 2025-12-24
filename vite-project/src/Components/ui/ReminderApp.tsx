/**
 * ReminderApp Component
 * Main application component
 */

import React, { useState, useEffect } from 'react';
import { useReminders } from '../context/ReminderContext';
import { useNotifications } from '../hooks/useNotifications';
import ReminderCard from './ReminderCard';
import ReminderForm from './ReminderForm';
import EmptyState from './EmptyState';
import './ReminderApp.css';

type TabType = 'active' | 'completed';

const ReminderApp: React.FC = () => {
    const {
        activeReminders,
        completedReminders,
        addReminder,
        completeReminder,
        deleteReminder,
        loading
    } = useReminders();

    const { permission, requestPermission, isSupported } = useNotifications();

    const [activeTab, setActiveTab] = useState<TabType>('active');
    const [showForm, setShowForm] = useState(false);

    // Request notification permission on mount
    useEffect(() => {
        if (isSupported && permission === 'default') {
            requestPermission();
        }
    }, [isSupported, permission, requestPermission]);

    const handleAddReminder = async (data: any) => {
        await addReminder(data);
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className="reminder-app">
                <div className="loading">Loading reminders...</div>
            </div>
        );
    }

    return (
        <div className="reminder-app">
            {/* Header */}
            <header className="app-header">
                <h1 className="app-title">Personal Reminders</h1>
                <p className="app-subtitle">Daily discipline and tracking</p>
            </header>

            {/* Notification Permission Banner */}
            {isSupported && permission !== 'granted' && (
                <div className="notification-banner">
                    <p className="banner-text">
                        Enable notifications to receive reminders on time
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={requestPermission}
                    >
                        Enable Notifications
                    </button>
                </div>
            )}

            {/* Add Reminder Button */}
            {!showForm && (
                <div className="add-button-container">
                    <button
                        className="btn btn-primary btn-add"
                        onClick={() => setShowForm(true)}
                    >
                        + Add Reminder
                    </button>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <ReminderForm
                    onSubmit={handleAddReminder}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active ({activeReminders.length})
                </button>
                <button
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed ({completedReminders.length})
                </button>
            </div>

            {/* Content */}
            <div className="tab-content">
                {activeTab === 'active' ? (
                    <div className="reminder-list">
                        {activeReminders.length === 0 ? (
                            <EmptyState message="No active reminders" />
                        ) : (
                            activeReminders.map((reminder) => (
                                <ReminderCard
                                    key={reminder.id}
                                    reminder={reminder}
                                    onComplete={completeReminder}
                                    onDelete={deleteReminder}
                                    showCheckbox={true}
                                />
                            ))
                        )}
                    </div>
                ) : (
                    <div className="reminder-list">
                        {completedReminders.length === 0 ? (
                            <EmptyState message="No completed reminders yet" />
                        ) : (
                            completedReminders.map((reminder) => (
                                <ReminderCard
                                    key={reminder.id}
                                    reminder={reminder}
                                    onDelete={deleteReminder}
                                    showCheckbox={false}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReminderApp;
