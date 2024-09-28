export type GeomapCityResult = {
  name: string,
  local_names?: {
    en?: string,
  },
  zip?: string,
  lat: number,
  lon: number,
  country: string,
  state?: string
};

export type SearchTerm = {
  term: string,
  isCityName: boolean
};

export type DropdownStatus = {
  isLoading: boolean,
  results: GeomapCityResult[],
  hasSearched: boolean, // For clearing old results
  showDropdown: boolean
};

export type ForecastResponse = {
  city: {},
  cnt: number,
  cod: string,
  list: RawForecast[]
};

export type RawForecast = {
  dt_txt: string,
  weather: [{
    main: string,
    description: string
  }],
  main: {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    humidity: number
  }
};

export type DailyForecast = {
  date: Date,
  weather: string,
  description: string,
  temp: number,
  high: number,
  low: number,
  feels_like: number,
  humidity: number
};