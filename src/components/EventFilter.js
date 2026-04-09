import React from 'react';
import '../styles/Events.css';

const CATEGORY = ['All','conference', 'workshop', 'seminar', 'networking', 'social', 'sports', 'other'];

const EventFilter = ({ search, category, onSearchChange, onCategoryChange }) => {
    return (
        <div className="event-filter">
            <input type="text" className="filter-search" placeholder="Search a event..."
                value={search} onChange={(e) => onSearchChange(e.target.value)} />
            <div className="filter-categories">
                {CATEGORY.map((cat) => (
                    <button key={cat} className={`filter-btn ${category === cat ? 'active' : ''}`}
                    onClick={() => onCategoryChange(cat)}
                    >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EventFilter;