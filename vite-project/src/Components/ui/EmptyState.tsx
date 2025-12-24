/**
 * EmptyState Component
 * Shown when no reminders exist
 */

import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
    message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p className="empty-state-message">{message}</p>
        </div>
    );
};

export default EmptyState;
