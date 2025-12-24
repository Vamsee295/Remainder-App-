/**
 * Color Theme Constants
 * White background with bold black text
 */

export const COLORS = {
    // Primary Background
    background: '#FFFFFF',

    // Text Colors
    textPrimary: '#000000',      // Bold black for headers/titles
    textSecondary: '#666666',    // Lighter black for metadata

    // UI Elements
    border: '#E0E0E0',
    shadow: '#000000',

    // Category Colors (with sufficient contrast on white)
    categoryJob: '#4CAF50',
    categoryStock: '#2196F3',
    categoryPersonal: '#FF9800',

    // Functional Colors
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
} as const;
