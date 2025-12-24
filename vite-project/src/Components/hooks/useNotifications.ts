/**
 * useNotifications Hook
 * Manages notification permissions
 */

import { useEffect, useState } from 'react';
import { NotificationService } from '../services/notificationService';

export const useNotifications = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        // Check current permission status
        if ('Notification' in window) {
            setPermission(NotificationService.getPermissionStatus());
        }
    }, []);

    const requestPermission = async (): Promise<boolean> => {
        const granted = await NotificationService.requestPermissions();
        setPermission(NotificationService.getPermissionStatus());
        return granted;
    };

    return {
        permission,
        requestPermission,
        isSupported: 'Notification' in window,
    };
};
