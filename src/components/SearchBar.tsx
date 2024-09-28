import { ChangeEvent } from 'react';
import { formatSuggestionBox } from '../Methods';
import { DropdownStatus, GeomapCityResult } from '../Types';
import '../styles/SearchBar.css';

type SearchBarProps = {
  dropdownStatus: DropdownStatus,
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void,
  handleSuggestionClick: (sugg: GeomapCityResult) => void,
  isHomePage: boolean
};

export default function SearchBar(props: SearchBarProps) {
  const { dropdownStatus, handleInputChange, handleSuggestionClick, isHomePage } = props;
  const isSearching: boolean = dropdownStatus.isLoading && dropdownStatus.showDropdown;
  const resultsNotFound: boolean =
    dropdownStatus.showDropdown &&
    !dropdownStatus.isLoading &&
    dropdownStatus.results.length == 0 &&
    dropdownStatus.hasSearched;
  const hasResultsToDisplay: boolean =
    dropdownStatus.showDropdown &&
    !dropdownStatus.isLoading &&
    dropdownStatus.results.length > 0;

  return (
    <div className={`search-holder ${isHomePage ? '' : 'forecast-bar'}`}>
        <input
          type="text"
          placeholder="Search city or zip code"
          onChange={(e) => handleInputChange(e)}
        />

        {resultsNotFound && (
          <div className='suggestion-dropdown'>
            <div className='suggestion-item'>No Results</div>
          </div>
        )} 

        {isSearching && (
          <div className='suggestion-dropdown'>
            <div className='suggestion-item'>Searching...</div>
          </div>
        )}

        {hasResultsToDisplay && (
          <div className='suggestion-dropdown'>
            {dropdownStatus.results.map((res: GeomapCityResult) => (
              <div className='suggestion-item' onClick={async () => handleSuggestionClick(res)}>
                {formatSuggestionBox(res)}
              </div>
            ))}
          </div>
        )}
      </div>
  );
}