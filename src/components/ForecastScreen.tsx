import { ChangeEvent, useEffect } from 'react';
import SearchBar from './SearchBar';
import { formatSuggestionBox } from '../Methods.ts';
import { DailyForecast, DropdownStatus, GeomapCityResult } from '../Types.ts';
import '../styles/ForecastScreen.css';

const RAIN_GRADIENT: string = 'linear-gradient(180.3deg, rgb(221, 221, 221) 5.5%, rgb(110, 136, 161) 90.2%)';
const CLEAR_GRADIENT: string = 'linear-gradient(342deg, rgba(145, 202, 255, 1) 0%, rgba(169, 213, 255, 1) 12%, rgba(69, 165, 255, 1) 100%)';

function renderWeatherEmoji(weather: string) {
  switch(true) {
    case weather.toUpperCase() === 'CLOUDS':
      return <p>⛅</p>;
    case weather.toUpperCase() === 'RAIN':
      return <p>🌧</p>;
    case weather.toUpperCase() === 'CLEAR':
      return <p>🌞</p>;
    case weather.toUpperCase() === 'SNOW':
      return <p>🌨</p>;
    case weather.toUpperCase() === 'DRIZZLE':
      return <p>🌦</p>;
    case weather.toUpperCase() === 'THUNDERSTORM':
      return <p>🌩</p>;
  }
}

type ForecastScreenProps = {
  dropdownStatus: DropdownStatus,
  dailyForecasts: DailyForecast[],
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void,
  handleSuggestionClick: (sugg: GeomapCityResult) => void
  selectedCity: GeomapCityResult
};

export default function ForecastScreen(props: ForecastScreenProps) {
  const { dailyForecasts, selectedCity } = props;

  useEffect(() => {
    if ((dailyForecasts[0].weather !== 'Clear') && (dailyForecasts[0].weather !== 'Clouds')) {
      document.body.style.background = RAIN_GRADIENT;
    } else {
      document.body.style.background = CLEAR_GRADIENT;
    }
  }, [selectedCity]);

  return (
    <div className='forecast-screen'>
      <SearchBar
        dropdownStatus={props.dropdownStatus}
        handleInputChange={props.handleInputChange}
        handleSuggestionClick={props.handleSuggestionClick}
        isHomePage={false}
      />
      <div className='hero-forecast'>
        <div>
          <p className="location-name">{formatSuggestionBox(selectedCity)}</p>
          <p>{dailyForecasts[0].date.toDateString()}</p>
          <p className='hero-temp'>{dailyForecasts[0].temp}&deg;<span>F</span></p>
        </div>
        <div className='emoji-holder'>{renderWeatherEmoji(dailyForecasts[0].weather)}</div>
      </div>

      
      <div className='five-day-forecast'>
        <p className='five-day-text'>5 Day Forecast:</p>
        <div className='forecast-calendar'>
          {dailyForecasts.map((fore, index) => {
            if (index !== 1) {
              return (
                <div className='forecast' key={index}>
                  <p>{index === 0 ? "Today" : (fore.date.toDateString().split(" ")[0])}</p>
                  <p>{renderWeatherEmoji(fore.weather)}</p>
                  <p>{fore.temp}&deg;</p>
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  );
}