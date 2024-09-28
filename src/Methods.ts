import { DailyForecast, GeomapCityResult, RawForecast } from './Types';

// API Methods:
const API_KEY = 'a5cf09098e6e9a89c8dcffddbe7b5e8c';
const OWM_API_URL = 'https://api.openweathermap.org';

export async function getCoordsFromZip(input: string) {
  const url = `${OWM_API_URL}/geo/1.0/zip?zip=${input}&limit=5&appid=${API_KEY}`;
  return await fetch(url)
    .then(res => res.json());
}

export async function getCoordsFromCityName(input: string) {
  const url = `${OWM_API_URL}/geo/1.0/direct?q=${input}&limit=5&appid=${API_KEY}`;
  return await fetch(url)
    .then(res => res.json());
}

export async function getForecastFromCoords(lat: number, lon: number) {
  const url = `${OWM_API_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  return await fetch(url)
    .then(res => res.json());
}

// Utility Methods:
function kelvinToFahrenheit(kelvinTemp: number) {
  return Math.round(((kelvinTemp - 273.15) * 1.8) + 32);
}

export function formatForecast(apiData: RawForecast) {
  return {
    date: new Date(apiData.dt_txt),
    weather: apiData.weather[0].main,
    description: apiData.weather[0].description,
    temp: kelvinToFahrenheit(apiData.main.temp),
    high: kelvinToFahrenheit(apiData.main.temp_max),
    low: kelvinToFahrenheit(apiData.main.temp_min),
    feels_like: kelvinToFahrenheit(apiData.main.feels_like),
    humidity: apiData.main.humidity
  } as DailyForecast;
}

export function formatSuggestionBox(result: GeomapCityResult) {
  return `${result.name}${result.state ? `, ${result.state}` : ''}, ${result.country}`;
}

export function isNumeric(str: string) {
  return /^[0-9]+$/.test(str);
}