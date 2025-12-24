/**
 * CategoryBadge Component
 * Displays reminder category with color coding
 */

import React from 'react';
import { ReminderCategory } from '../types/reminder.types';
import { CATEGORY_CONFIG } from '../utils/categories';
import './CategoryBadge.css';

interface CategoryBadgeProps {
    category: ReminderCategory;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
    const config = CATEGORY_CONFIG[category];

    return (
        <span
            className="category-badge"
            style={{ backgroundColor: config.color }}
        >
            {config.label}
        </span>
    );
};

export default CategoryBadge;
