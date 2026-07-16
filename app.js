const apiKey = "3fa6568efa78130e4a771cdf6d6cf598";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric";
const reverseGeocodeUrl = "https://api.openweathermap.org/geo/1.0/reverse";

const input = document.getElementById("searchBar");
const searchBtn = document.getElementById("button");
const locationBtn = document.getElementById("locationButton");

const iconMap = {
  Clear: "icon-sunny.webp",
  Clouds: "icon-overcast.webp",
  Rain: "icon-rain.webp",
  Drizzle: "icon-drizzle.webp",
  Snow: "icon-snow.webp",
  Thunderstorm: "icon-storm.webp",
  Mist: "icon-fog.webp",
  Fog: "icon-fog.webp",
  Haze: "icon-fog.webp"
};

const iconFor = (main) => `images/${iconMap[main] || "icon-partly-cloudy.webp"}`;
const dayName = (date) => new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date);

function setLoading(isLoading) {
  searchBtn.disabled = isLoading;
  searchBtn.classList.toggle("loading", isLoading);
}

function showError(message = "") {
  document.getElementById("error").textContent = message;
}

function updateTip(main, temp) {
  const tipText = document.getElementById("tipText");

  if (!tipText) {
    return;
  }

  tipText.textContent =
    main === "Rain" || main === "Drizzle"
      ? "Rain is expected. A compact umbrella will come in handy."
      : temp > 30
        ? "It is a warm day — water and shade will keep you comfortable."
        : "A light layer is all you need today. Enjoy the weather!";
}

function renderCurrent(data) {
  const weather = data.weather[0];
  const now = new Date();

  document.getElementById("dateText").textContent =
    `Today, ${new Intl.DateTimeFormat(undefined, { month: "long", day: "numeric" }).format(now)}`;

  document.querySelector(".city").textContent = data.name;
  document.getElementById("locationDetail").textContent = data.sys.country;
  document.getElementById("condition").textContent = weather.description.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
  document.querySelector(".temp").textContent = Math.round(data.main.temp);
  document.getElementById("feelsLike").textContent = `${Math.round(data.main.feels_like)}°`;
  document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
  document.querySelector(".wind").textContent = `${data.wind.speed.toFixed(1)} m/s`;
  document.querySelector(".visibility").textContent = `${((data.visibility || 0) / 1000).toFixed(data.visibility < 10000 ? 1 : 0)} km`;
  document.querySelector(".pressure").textContent = `${data.main.pressure} hPa`;

  const image = document.querySelector(".weather-icon");
  image.src = iconFor(weather.main);
  image.alt = weather.description;

  updateTip(weather.main, data.main.temp);
}

async function updateLocationDetail({ lat, lon }, country) {
  const locationDetail = document.getElementById("locationDetail");

  try {
    const response = await fetch(
      `${reverseGeocodeUrl}?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    );
    const [place] = await response.json();
    const region = place?.state || place?.name;

    locationDetail.textContent =
      region && country
        ? `${region}, ${country}`
        : country || region || "Location unavailable";
  } catch {
    locationDetail.textContent = country || "Location unavailable";
  }
}

function renderForecast(items) {
  const daily = [];
  const seen = new Set();

  items.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const key = date.toDateString();

    if (!seen.has(key) && date.getHours() >= 11) {
      seen.add(key);
      daily.push(item);
    }
  });

  const forecastDays = [...daily.slice(0, 7)];

  while (forecastDays.length < 7) {
    const lastItem = forecastDays[forecastDays.length - 1] || items[items.length - 1];
    const nextDate = new Date((lastItem.dt + 86400) * 1000);

    forecastDays.push({
      ...lastItem,
      dt: nextDate.getTime() / 1000,
      weather: lastItem.weather
    });
  }

  document.getElementById("forecastList").innerHTML = forecastDays
    .map((item) => {
      const weather = item.weather[0];
      const dayLabel = dayName(new Date(item.dt * 1000));

      return `<article class="forecast-item">
        <img src="${iconFor(weather.main)}" alt="">
        <div>
          <strong>${dayLabel}</strong>
        </div>
        <span class="forecast-temp">${Math.round(item.main.temp)}°</span>
      </article>`;
    })
    .join("");
}

function clearWeather() {
  document.getElementById("weather").hidden = true;
  document.getElementById("forecastList").innerHTML = "";

  const tipText = document.getElementById("tipText");
  if (tipText) {
    tipText.textContent = "Search for a valid city to see its weather outlook.";
  }
}

async function checkWeather(query) {
  if (!query.trim()) {
    return showError("Enter a city to see its weather.");
  }

  setLoading(true);
  showError();

  try {
    const weatherResponse = await fetch(
      `${weatherUrl}&q=${encodeURIComponent(query)}&appid=${apiKey}`
    );

    if (!weatherResponse.ok) {
      throw new Error(
        weatherResponse.status === 404
          ? "We couldn't find that city. Try another search."
          : "Weather is unavailable right now. Please try again."
      );
    }

    const weather = await weatherResponse.json();
    document.getElementById("weather").hidden = false;
    renderCurrent(weather);
    updateLocationDetail(weather.coord, weather.sys.country);

    const forecastResponse = await fetch(
      `${forecastUrl}&q=${encodeURIComponent(query)}&appid=${apiKey}`
    );

    if (forecastResponse.ok) {
      renderForecast((await forecastResponse.json()).list);
    }
  } catch (error) {
    clearWeather();
    showError(error.message);
  } finally {
    setLoading(false);
  }
}

function locate() {
  if (!navigator.geolocation) {
    return showError("Location is not supported by this browser.");
  }

  locationBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      try {
        const response = await fetch(
          `${weatherUrl}&lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error();
        }

        await checkWeather(data.name);
      } catch {
        showError("We couldn't retrieve weather for your location.");
      } finally {
        locationBtn.disabled = false;
      }
    },
    () => {
      locationBtn.disabled = false;
      showError("Location access was not granted.");
    }
  );
}

searchBtn.addEventListener("click", () => checkWeather(input.value));
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkWeather(input.value);
  }
});
locationBtn.addEventListener("click", locate);

renderForecast([
  { dt: Date.now() / 1000 + 86400, main: { temp: 31 }, weather: [{ main: "Clear" }] },
  { dt: Date.now() / 1000 + 172800, main: { temp: 30 }, weather: [{ main: "Clouds" }] },
  { dt: Date.now() / 1000 + 259200, main: { temp: 29 }, weather: [{ main: "Rain" }] },
  { dt: Date.now() / 1000 + 345600, main: { temp: 31 }, weather: [{ main: "Clear" }] },
  { dt: Date.now() / 1000 + 432000, main: { temp: 30 }, weather: [{ main: "Clouds" }] },
  { dt: Date.now() / 1000 + 518400, main: { temp: 28 }, weather: [{ main: "Rain" }] },
  { dt: Date.now() / 1000 + 604800, main: { temp: 27 }, weather: [{ main: "Clouds" }] }
]);
