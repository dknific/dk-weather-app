# dk-weather-app
Use React.js, TypeScript, and the [OpenWeatherMap API](https://openweathermap.org/api) to get live 5-day forecasts.

## Live Demo
To try out the app, [click here!](https://www.daveyknific.com/weather/index.html)

## To Run Locally:
*This project uses [Vite](https://vite.dev/guide/why.html) for building and developing.*

To run locally, you will need a valid API key from OpenWeatherMap.

### Providing an API Key:

Create a file called `.env` in the root level of the repo, then copy the contents of the `.env.example` file into it, replacing the example text with your secret API key. The `.gitignore` will make sure you don't accidentally commit your API key in this file.

### Install Dependencies and Run:

Once you've set your API key, navigate to the root directory of this project and run the following commands:

    npm install   // installs dependencies
    npx vite      // runs dev server

## Build for Production:
Run `npx vite build` to build a production-ready app.