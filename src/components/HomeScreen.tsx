import { ChangeEvent } from 'react';
import SVGRenderer from './SvgRenderer';
import SearchBar from './SearchBar';
import { DropdownStatus, GeomapCityResult } from '../Types.ts';
import '../styles/HomeScreen.css';

type HomeScreenProps = {
  dropdownStatus: DropdownStatus,
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void,
  handleSuggestionClick: (sugg: GeomapCityResult) => void
};

export default function HomeScreen(props: HomeScreenProps) {
  const { dropdownStatus, handleInputChange, handleSuggestionClick } = props;

  return (
    <div className='home-screen'>
      <h1>Weather.</h1>
      <p className='instructions'>Select a result from the search dropdown.</p>

      <SearchBar
        dropdownStatus={dropdownStatus}
        handleInputChange={handleInputChange}
        handleSuggestionClick={handleSuggestionClick}
        isHomePage={true}
      />

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
  );
}