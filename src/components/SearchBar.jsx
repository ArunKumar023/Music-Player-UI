import React, { useState } from 'react';
import '../styles/SearchBar.scss';
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <input
      className="search-input"
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search songs or artists..."
    />
  );
};

export default SearchBar;