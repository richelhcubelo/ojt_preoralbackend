import React from "react";
import "./searchbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleInputChange}
        />
      </div>
      <div className="filter">
        <FontAwesomeIcon icon={faFilter} className="filter-icon" />
        <select>
          <option value="">Filter</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
