import { ChangeEvent, useEffect, useState } from 'react';
import ReactLogo from './assets/react.svg';
import Navbar from './components/Navbar';
import HomeScreen from './components/HomeScreen';
import ForecastScreen from './components/ForecastScreen';
import {
  formatForecast,
  getCoordsFromCityName,
  getCoordsFromZip,
  getForecastFromCoords,
  isNumeric
} from './Methods';
import {
  DailyForecast,
  DropdownStatus,
  GeomapCityResult,
  RawForecast,
  SearchTerm
} from './Types';
import './styles/App.css';

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
              showDropDown: true,
              isLoading: false,
              results: response,
              hasSearched: true,
            };
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

  // Handle user events:
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
    setDropdownStatus({ ...dropdownStatus, showDropdown: false, results: [] });
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

  return (
    <>
      <Navbar />
      {!isLoadingForecast && !forecast && (
        <HomeScreen
          dropdownStatus={dropdownStatus}
          handleInputChange={handleInputChange}
          handleSuggestionClick={handleSuggestionClick}
        />
      )}

      {isLoadingForecast && (
        <div className='loading-screen'>
          <p className='loading-message'>Loading your forecast...</p>
          <img src={ReactLogo} className='react-spinner' />
          <p className='learn-more'>Learn more about <a href="https://openweathermap.org/guide" target="_blank">OpenWeatherMap's public API.</a></p>
        </div>
      )}

      {!isLoadingForecast && forecast && selectedCity && (
        <ForecastScreen
          dailyForecasts={forecast}
          dropdownStatus={dropdownStatus}
          handleInputChange={handleInputChange}
          handleSuggestionClick={handleSuggestionClick}
          selectedCity={selectedCity}
        />
      )}
    </>
  )
}

export default App
