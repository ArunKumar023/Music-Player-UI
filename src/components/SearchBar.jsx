import React from 'react';
import { FormControl } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <FormControl
        type="text"
        placeholder="Search Song, Artist"
        onChange={handleSearch}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;