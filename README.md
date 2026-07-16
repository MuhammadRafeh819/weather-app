# Skycast Weather App

A modern, responsive weather dashboard built with HTML, CSS, and JavaScript. The app fetches live weather information from the OpenWeatherMap API and presents it through a clean glassmorphism-inspired interface with an elegant, user-friendly layout.

Live Demo: https://weather-app-990.netlify.app/

## Overview

Skycast is a lightweight frontend weather application designed to provide quick access to current weather, air conditions, and a 7-day forecast for any searched city. It is built as a static website and can be hosted easily on Netlify, GitHub Pages, or any other static hosting service.

## Features

- Real-time current weather data for any city
- 7-day forecast rendering with weekday labels
- Humidity, wind speed, visibility, and pressure display
- Location-based weather lookup using browser geolocation
- Responsive layout for mobile and desktop screens
- Graceful error handling for invalid city searches
- Premium glassmorphism-style UI with animated cards and icons

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- OpenWeatherMap API

## Project Structure

```text
weather-done/
├── app.js              # Weather API logic, DOM rendering, and search interactions
├── index.html          # Main layout and UI structure
├── style.css           # Visual styling, responsive layout, and component design
├── images/             # Weather icons and visual assets
├── image.png           # App preview screenshot
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- A modern browser
- Internet access
- An OpenWeatherMap API key



## Usage

- Enter a city name in the search box
- Click Search to fetch weather details
- Use Use my location to get weather for your current coordinates
- Review the current weather and upcoming weekly forecast cards

## Deployment

The project is deployed live on Netlify:

https://weather-app-990.netlify.app/




## Future Enhancements

- Add hourly forecast view
- Include sunrise and sunset times
- Add dark/light theme toggle
- Support more detailed air quality data
- Improve UX with smoother transitions and loading states

