import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <div className="navbar">
      <a className='portfolio-link' href="https://www.daveyknific.com">
        <div className='photo-holder'></div>
      </a>
      <a className='code-link' href="https://www.github.com/dknific/dk-weather-app" target="_blank">View Source Code</a>
    </div>
  );
}