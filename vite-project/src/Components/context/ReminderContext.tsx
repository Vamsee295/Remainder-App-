/**
 * Reminder Context
 * Global state management for reminders
 */

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Reminder, ReminderFormData } from '../types/reminder.types';
import { StorageService } from '../services/storageService';
import { ReminderService } from '../services/reminderService';

// State type
interface ReminderState {
    reminders: Reminder[];
    loading: boolean;
}

// Action types
type ReminderAction =
    | { type: 'SET_REMINDERS'; payload: Reminder[] }
    | { type: 'ADD_REMINDER'; payload: Reminder }
    | { type: 'UPDATE_REMINDERS'; payload: Reminder[] }
    | { type: 'SET_LOADING'; payload: boolean };

// Context type
interface ReminderContextType {
    reminders: Reminder[];
    activeReminders: Reminder[];
    completedReminders: Reminder[];
    loading: boolean;
    addReminder: (data: ReminderFormData) => Promise<void>;
    completeReminder: (id: string) => Promise<void>;
    deleteReminder: (id: string) => Promise<void>;
}

// Create context
const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

// Reducer
const reminderReducer = (state: ReminderState, action: ReminderAction): ReminderState => {
    switch (action.type) {
        case 'SET_REMINDERS':
            return { ...state, reminders: action.payload };
        case 'ADD_REMINDER':
            return { ...state, reminders: [...state.reminders, action.payload] };
        case 'UPDATE_REMINDERS':
            return { ...state, reminders: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

// Provider component
export const ReminderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reminderReducer, {
        reminders: [],
        loading: true,
    });

    // Load reminders on mount
    useEffect(() => {
        const loadedReminders = StorageService.loadReminders();
        dispatch({ type: 'SET_REMINDERS', payload: loadedReminders });
        dispatch({ type: 'SET_LOADING', payload: false });
    }, []);

    // Add reminder
    const addReminder = async (data: ReminderFormData): Promise<void> => {
        try {
            const newReminder = await ReminderService.createReminder(data, state.reminders);
            dispatch({ type: 'ADD_REMINDER', payload: newReminder });
        } catch (error) {
            console.error('Failed to add reminder:', error);
            alert('Failed to create reminder');
        }
    };

    // Complete reminder
    const completeReminder = async (id: string): Promise<void> => {
        try {
            const updatedReminders = await ReminderService.completeReminder(id, state.reminders);
            dispatch({ type: 'UPDATE_REMINDERS', payload: updatedReminders });
        } catch (error) {
            console.error('Failed to complete reminder:', error);
            alert('Failed to complete reminder');
        }
    };

    // Delete reminder
    const deleteReminder = async (id: string): Promise<void> => {
        try {
            const updatedReminders = await ReminderService.deleteReminder(id, state.reminders);
            dispatch({ type: 'UPDATE_REMINDERS', payload: updatedReminders });
        } catch (error) {
            console.error('Failed to delete reminder:', error);
            alert('Failed to delete reminder');
        }
    };

    const value: ReminderContextType = {
        reminders: state.reminders,
        activeReminders: ReminderService.getActiveReminders(state.reminders),
        completedReminders: ReminderService.getCompletedReminders(state.reminders),
        loading: state.loading,
        addReminder,
        completeReminder,
        deleteReminder,
    };

    return <ReminderContext.Provider value={value}>{children}</ReminderContext.Provider>;
};

// Custom hook to use context
export const useReminders = (): ReminderContextType => {
    const context = useContext(ReminderContext);
    if (!context) {
        throw new Error('useReminders must be used within ReminderProvider');
    }
    return context;
};
