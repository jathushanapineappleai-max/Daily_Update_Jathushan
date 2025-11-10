import React from 'react';
import './SearchBar.css';

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder || 'Search...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;