import { ChangeEvent, useEffect, useState } from 'react';
import { DailyForecast, DropdownStatus, GeomapCityResult, RawForecast, SearchTerm } from './Types';
import ReactLogo from './assets/react.svg';
import SVGRenderer from './components/SvgRenderer';
import Navbar from './components/Navbar';
import {
  formatForecast,
  formatSuggestionBox,
  getCoordsFromCityName,
  getCoordsFromZip,
  getForecastFromCoords,
  isNumeric
} from './methods';
import './App.css';

const EMPTY_SEARCH_TERM: SearchTerm = {
  term: '',
  isCityName: false
};

const DEFAULT_DROPDOWN: DropdownStatus = {
  isLoading: false,
  results: [],
  hasSearched: false,
  showDropdown: false
};

function App() {
  const [debounceTimer, setDebounceTimer] = useState<number>();
  const [searchTerm, setSearchTerm] = useState<SearchTerm>(EMPTY_SEARCH_TERM);
  const [selectedCity, setSelectedCity] = useState<GeomapCityResult | undefined>();
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);
  const [forecast, setForecast] = useState<DailyForecast[] | undefined>();
  const [dropdownStatus, setDropdownStatus] = useState<DropdownStatus>({
    ...DEFAULT_DROPDOWN
  });

  // Query different API endpoints
  // based on zip code or place name:
  useEffect(() => {
    if (searchTerm.isCityName) {
      setDropdownStatus({
        ...dropdownStatus,
        isLoading: true,
        results: [],
        hasSearched: true
      });

      async function getStringCoords() {
        await getCoordsFromCityName(searchTerm.term)
          .then(response => {
            const newSugs = {
              ...dropdownStatus,
              isLoading: false,
              results: response };
            setDropdownStatus(newSugs);
          });
      }
      getStringCoords();
    } else if (!searchTerm.isCityName && searchTerm.term.length > 0) {
      setDropdownStatus({
        ...dropdownStatus,
        isLoading: true,
        results: [],
        hasSearched: true
      });

      async function getZipCoords() {
        await getCoordsFromZip(searchTerm.term)
          .then((response: GeomapCityResult) => {
            let newDropdownStatus: DropdownStatus;

            if (response.zip) {
              newDropdownStatus = {
                ...dropdownStatus,
                isLoading: false,
                results: [{ ...response }]
              };
            } else {
              newDropdownStatus = {
                ...dropdownStatus,
                isLoading: false,
                results: []
              };
            }
            setDropdownStatus(newDropdownStatus);
          })
          .catch(() => setDropdownStatus({
            ...dropdownStatus,
            isLoading: false,
            results: []
          }));
      }
      getZipCoords();
    }
  }, [searchTerm]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const userInput: string = e.target.value;

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (userInput.length > 2) {
      setDropdownStatus({ ...dropdownStatus, showDropdown: true });

      const newTimer: number = setTimeout(() => {
        const isCityName: boolean = !isNumeric(userInput);
        setSearchTerm({ term: userInput, isCityName });
      }, 700);
      setDebounceTimer(newTimer);
    } else {
      setDropdownStatus({ ...DEFAULT_DROPDOWN });
    }
  }

  async function handleSuggestionClick(suggestion: GeomapCityResult) {
    setIsLoadingForecast(true);
    setSelectedCity(suggestion);
    await getForecastFromCoords(suggestion.lat, suggestion.lon)
      .then(response => {
        const rawForecasts: RawForecast[] = response.list.filter((fore: RawForecast) => {
          const dateToEvaluate = new Date(fore.dt_txt);
          return dateToEvaluate.getHours() === 15;
        });
        rawForecasts.unshift(response.list[0]);
        const formattedForecasts: DailyForecast[] = rawForecasts.map(fore => formatForecast(fore));
        setForecast(formattedForecasts);
      });
    setIsLoadingForecast(false);
  }

  const isSearching: boolean = dropdownStatus.isLoading && dropdownStatus.showDropdown;
  const resultsNotFound: boolean =
    dropdownStatus.showDropdown &&
    !dropdownStatus.isLoading &&
    dropdownStatus.results.length === 0 &&
    dropdownStatus.hasSearched;
  const hasResultsToDisplay: boolean =
    dropdownStatus.showDropdown &&
    !dropdownStatus.isLoading &&
    dropdownStatus.results.length > 0;

  return (
    <>
      <Navbar />
      {!isLoadingForecast && !forecast && (
        <div className='home-screen'>
          <h1>Weather.</h1>
          <p>Select a result from the search dropdown.</p>

          <div className='search-holder'>
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

          <div className="svg-holder">
            <p>Powered by:</p>
            <div className='svg-row-one'>
            <SVGRenderer svgName='TYPESCRIPT' />
            +
            <SVGRenderer svgName='REACT' />
            </div>
            <SVGRenderer svgName='OPEN_WEATHER' />
          </div>
        </div>
      )}

      {isLoadingForecast && (
        <div className='loading-screen'>
          <p className='loading-message'>Loading your forecast...</p>
          <img src={ReactLogo} className='react-spinner' />
          <p className='learn-more'>Learn more about <a href="https://openweathermap.org/guide" target="_blank">OpenWeatherMap's public API.</a></p>
        </div>
      )}

      {!isLoadingForecast && forecast && selectedCity && (
        <div>
          
          <div className='hero-forecast'>
            <div>
              <p className="location-name">{formatSuggestionBox(selectedCity)}</p>
              <p>{forecast[0].date.toDateString()}</p>
              <p className='hero-temp'>{forecast[0].temp}&deg;<span>F</span></p>
            </div>
            <div className='emoji-holder'><p>🌞</p></div>
          </div>
          <div className='week-forecast'>
            {forecast.map((fore, index) => {
              if (index > 0) {
                return (
                  <div className='forecast' key={index}>
                    <p>{fore.date.toDateString().split(" ")[0]}</p>
                    <p>🌞</p>
                    <p>{fore.high}&deg;/{fore.low}&deg;</p>
                  </div>
                )
              }
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default App
